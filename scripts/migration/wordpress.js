const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { Readable, Transform } = require('stream')
const { pipeline } = require('stream/promises')
const { HttpError, withRetry } = require('./retry')
const { extractExtension, extractFilename, toWordPressDownloadUrl, uploadsPath } = require('./urls')
const { inspectDownload } = require('./files')

function summarizeMedia(record) {
  return {
    id: record.id,
    sourceUrl: record.source_url,
    mimeType: record.mime_type,
    date: record.date,
    slug: record.slug,
  }
}

function selectMediaRecord(records, originalUrl) {
  const wantPath = uploadsPath(originalUrl)
  if (!wantPath) return { error: 'not_wordpress' }
  const want = wantPath.toLowerCase()
  const matches = (records || []).filter((record) => {
    const got = record?.source_url ? uploadsPath(record.source_url) : null
    return got && got.toLowerCase() === want
  })
  if (matches.length === 1) return { record: matches[0] }
  if (matches.length > 1) {
    const mimeTypes = new Set(matches.map((record) => record.mime_type || ''))
    if (mimeTypes.size > 1) {
      return { error: 'ambiguous', candidates: matches.map(summarizeMedia) }
    }
    return { record: matches[0] }
  }
  const filename = (extractFilename(originalUrl) || '').toLowerCase()
  const sameName = (records || []).filter((record) => {
    return (extractFilename(record?.source_url || '') || '').toLowerCase() === filename && filename
  })
  if (sameName.length > 0) {
    return { error: 'path_mismatch', candidates: sameName.map(summarizeMedia) }
  }
  return { error: 'not_found' }
}

function createWordPress(config, options = {}) {
  const fetchImpl = options.fetch || fetch
  const retries = options.retries ?? config.retries
  const delayMs = options.delayMs ?? config.delayMs

  function authHeaders() {
    const headers = {
      accept: 'application/json',
      'user-agent': 'coessing-media-migration',
    }
    if (config.wpUsername && config.wpAppPassword) {
      const credentials = Buffer.from(`${config.wpUsername}:${config.wpAppPassword}`).toString('base64')
      headers.authorization = `Basic ${credentials}`
    }
    return headers
  }

  async function request(url, init = {}) {
    return withRetry(
      async () => {
        if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
        const response = await fetchImpl(url, {
          ...init,
          headers: { ...authHeaders(), ...(init.headers || {}) },
          signal: AbortSignal.timeout(init.timeoutMs || 600000),
        })
        if (!response.ok) {
          throw new HttpError(`WordPress request failed with HTTP ${response.status}`, response.status)
        }
        return response
      },
      { retries, baseDelayMs: 500 }
    )
  }

  async function searchMedia(search) {
    const records = []
    for (let page = 1; page <= 10; page += 1) {
      const url = new URL('/wp-json/wp/v2/media', config.wpUrl)
      url.searchParams.set('search', search)
      url.searchParams.set('per_page', '20')
      url.searchParams.set('page', String(page))
      let response
      try {
        response = await request(url)
      } catch (error) {
        if (error.status === 400 && page > 1) break
        throw error
      }
      const body = await response.json()
      if (!Array.isArray(body) || body.length === 0) break
      records.push(...body)
      const totalPages = Number(response.headers.get('x-wp-totalpages') || 1)
      if (page >= totalPages) break
    }
    return records
  }

  async function findMedia(originalUrl) {
    const filename = extractFilename(originalUrl)
    if (!filename) {
      const error = new Error('URL is not a WordPress uploads path')
      error.code = 'not_wordpress'
      throw error
    }
    const stem = filename.replace(/\.[^.]+$/, '')
    const queries = [...new Set([stem, filename].filter(Boolean))]
    let records = []
    for (const query of queries) {
      const found = await searchMedia(query)
      records = records.concat(found)
      const selected = selectMediaRecord(records, originalUrl)
      if (selected.record) return selected.record
      if (selected.error === 'ambiguous') {
        const error = new Error('Multiple WordPress media records match this upload path')
        error.code = 'ambiguous'
        error.candidates = selected.candidates
        throw error
      }
    }
    const selected = selectMediaRecord(records, originalUrl)
    if (selected.record) return selected.record
    const error = new Error(
      selected.error === 'path_mismatch'
        ? 'WordPress has a file with the same name but a different upload path'
        : 'WordPress media record was not found'
    )
    error.code = selected.error || 'not_found'
    error.candidates = selected.candidates || []
    throw error
  }

  async function download(record, destDir) {
    const filename = extractFilename(record.source_url) || `media-${record.id}`
    const extension = extractExtension(filename)
    const downloadUrl = toWordPressDownloadUrl(record.source_url, config.wpUrl)
    fs.mkdirSync(destDir, { recursive: true })
    const tempName = path.basename(filename).replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    const filePath = path.join(destDir, `${record.id}-${tempName}`)

    const response = await request(downloadUrl, { timeoutMs: 600000 })
    const contentType = (response.headers.get('content-type') || '').split(';')[0].trim()
    if (contentType.toLowerCase().includes('text/html')) {
      throw new HttpError('WordPress returned HTML instead of the media file', 200, { retryable: false })
    }

    const hash = crypto.createHash('sha256')
    let size = 0
    const prefixChunks = []
    let prefixLength = 0
    const hasher = new Transform({
      transform(chunk, _encoding, callback) {
        hash.update(chunk)
        size += chunk.length
        if (prefixLength < 64) {
          prefixChunks.push(chunk)
          prefixLength += chunk.length
        }
        callback(null, chunk)
      },
    })
    await pipeline(Readable.fromWeb(response.body), hasher, fs.createWriteStream(filePath))
    const prefix = Buffer.concat(prefixChunks).subarray(0, 64)
    const inspection = inspectDownload({
      buffer: prefix,
      extension,
      mimeType: record.mime_type || contentType,
      size,
      expectedSize: record.media_details?.filesize,
    })
    if (!inspection.ok) {
      fs.rmSync(filePath, { force: true })
      const error = new Error(inspection.reason)
      error.retryable = false
      throw error
    }
    return {
      filePath,
      filename,
      extension,
      hash: hash.digest('hex'),
      size,
      mimeType: inspection.mimeType,
      downloadUrl,
    }
  }

  return {
    findMedia,
    download,
    searchMedia,
    selectMediaRecord,
  }
}

module.exports = {
  createWordPress,
  selectMediaRecord,
  summarizeMedia,
}
