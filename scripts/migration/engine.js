const fs = require('fs')
const path = require('path')
const { extractFilename } = require('./urls')
const {
  findPlainTextWordPressUrls,
  findWordPressLinks,
  replaceLinkHrefs,
  compactRichText,
  diffContent,
  walkRichText,
} = require('./richtext')

const HYGRAPH_MAX_ASSET_BYTES = 50 * 1024 * 1024

function errorText(error) {
  return error?.message || 'Unknown error'
}

function oversizedMessage(size) {
  return `File is ${size} bytes, above Hygraph's ${HYGRAPH_MAX_ASSET_BYTES} byte upload limit`
}

function isOversizedFailure(message) {
  return typeof message === 'string' && /EntityTooLarge|exceeds the maximum allowed size/i.test(message)
}

async function mapSequential(items, visitor) {
  const results = []
  for (const item of items) results.push(await visitor(item))
  return results
}

async function mapPooled(items, limit, visitor) {
  if (limit <= 1 || items.length <= 1) return mapSequential(items, visitor)
  const results = new Array(items.length)
  let cursor = 0
  let chain = Promise.resolve()
  const lock = (fn) => {
    const run = chain.then(fn, fn)
    chain = run.then(
      () => undefined,
      () => undefined
    )
    return run
  }
  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await visitor(items[index], lock)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

function selectSchools(schools, options) {
  if (options.id) {
    return schools.filter((school) => school.id === options.id || school.slug === options.id)
  }
  if (!options.years) return schools
  return schools.filter((school) => options.years.includes(school.schoolYear))
}

async function resolveLink(school, fieldName, link, ctx, lock = (fn) => fn()) {
  const base = {
    schoolId: school.id,
    schoolName: school.schoolName,
    schoolYear: school.schoolYear,
    fieldName,
    originalUrl: link.href,
    linkText: link.text,
    filename: extractFilename(link.href),
  }
  const write = (row) => lock(() => ctx.store.upsertLink({ ...base, ...row }))
  const existing = await lock(() => ctx.store.getLink(school.id, fieldName, link.href))

  if (ctx.identifyOnly) {
    if (!existing) {
      await write({ status: 'DISCOVERED' })
    }
    return { href: link.href, hygraphUrl: existing?.hygraph_url || null, status: existing?.status || 'DISCOVERED' }
  }

  if (existing?.hygraph_url) {
    return {
      href: link.href,
      hygraphUrl: existing.hygraph_url,
      reused: existing.reused === 1,
      status: existing.status,
      filename: existing.filename,
    }
  }

  if (existing?.status === 'SKIPPED' && existing.failure_stage === 'size') {
    return {
      href: link.href,
      skipped: true,
      status: 'SKIPPED',
      filename: existing.filename,
      error: existing.error_message,
    }
  }

  if (!ctx.dryRun && !ctx.identifyOnly && isOversizedFailure(existing?.error_message)) {
    await write({
      filename: existing.filename,
      fileHash: existing.file_hash,
      wpMediaId: existing.wp_media_id,
      status: 'SKIPPED',
      failureStage: 'size',
      errorMessage: existing.error_message,
    })
    return {
      href: link.href,
      skipped: true,
      status: 'SKIPPED',
      filename: existing.filename,
      error: existing.error_message,
    }
  }

  if (!ctx.dryRun && !ctx.identifyOnly && existing?.hygraph_asset_id) {
    try {
      const asset = await ctx.hygraph.finalizeAsset(existing.hygraph_asset_id)
      await write({
        filename: existing.filename,
        fileHash: existing.file_hash,
        wpMediaId: existing.wp_media_id,
        hygraphAssetId: asset.id,
        hygraphUrl: asset.url,
        status: 'UPLOADED',
        reused: existing.reused === 1,
      })
      if (existing.file_hash) {
        await lock(() =>
          ctx.store.saveAsset({
            fileHash: existing.file_hash,
            originalUrl: link.href,
            wpMediaId: existing.wp_media_id,
            filename: existing.filename || asset.fileName,
            mimeType: asset.mimeType,
            byteSize: asset.size,
            hygraphAssetId: asset.id,
            hygraphUrl: asset.url,
          })
        )
      }
      return {
        href: link.href,
        hygraphUrl: asset.url,
        hygraphAssetId: asset.id,
        status: 'UPLOADED',
        filename: existing.filename || asset.fileName,
        fileHash: existing.file_hash,
        reused: existing.reused === 1,
      }
    } catch (error) {
      if (ctx.log) ctx.log(`${existing.filename || 'file'} will be uploaded again after the previous attempt did not finish`)
    }
  }

  let media
  try {
    media = await ctx.wordpress.findMedia(link.href)
  } catch (error) {
    const skipped = ['not_found', 'ambiguous', 'path_mismatch', 'not_wordpress'].includes(error.code)
    await write({
      status: skipped ? 'SKIPPED' : 'FAILED',
      failureStage: skipped ? null : 'download',
      errorMessage: errorText(error),
      wpMediaId: null,
    })
    return { href: link.href, skipped, error: errorText(error), status: skipped ? 'SKIPPED' : 'FAILED' }
  }

  const advertisedSize = Number(media.media_details?.filesize)
  if (Number.isFinite(advertisedSize) && advertisedSize > HYGRAPH_MAX_ASSET_BYTES) {
    const message = oversizedMessage(advertisedSize)
    await write({
      filename: extractFilename(media.source_url) || base.filename,
      wpMediaId: media.id,
      status: 'SKIPPED',
      failureStage: 'size',
      errorMessage: message,
    })
    return { href: link.href, skipped: true, status: 'SKIPPED', filename: base.filename, error: message }
  }

  let downloaded
  try {
    downloaded = await ctx.wordpress.download(media, ctx.config.downloadDir)
  } catch (error) {
    await write({
      status: 'FAILED',
      failureStage: 'download',
      errorMessage: errorText(error),
      wpMediaId: media.id,
    })
    return { href: link.href, error: errorText(error), status: 'FAILED' }
  }

  const reusable = await lock(() =>
    ctx.store.findReusableAsset({ fileHash: downloaded.hash, originalUrl: link.href })
  )
  if (reusable?.hygraph_url) {
    await write({
      filename: downloaded.filename,
      fileHash: downloaded.hash,
      wpMediaId: media.id,
      hygraphAssetId: reusable.hygraph_asset_id,
      hygraphUrl: reusable.hygraph_url,
      status: ctx.dryRun ? 'DOWNLOADED' : 'UPLOADED',
      reused: ctx.dryRun ? 0 : 1,
    })
    return {
      href: link.href,
      hygraphUrl: ctx.dryRun ? null : reusable.hygraph_url,
      reused: !ctx.dryRun,
      status: ctx.dryRun ? 'DOWNLOADED' : 'UPLOADED',
      filename: downloaded.filename,
      fileHash: downloaded.hash,
    }
  }

  if (downloaded.size > HYGRAPH_MAX_ASSET_BYTES) {
    const message = oversizedMessage(downloaded.size)
    await write({
      filename: downloaded.filename,
      fileHash: downloaded.hash,
      wpMediaId: media.id,
      status: 'SKIPPED',
      failureStage: 'size',
      errorMessage: message,
    })
    return {
      href: link.href,
      skipped: true,
      status: 'SKIPPED',
      filename: downloaded.filename,
      error: message,
    }
  }

  if (ctx.dryRun) {
    await write({
      filename: downloaded.filename,
      fileHash: downloaded.hash,
      wpMediaId: media.id,
      status: 'DOWNLOADED',
      reused: 0,
    })
    return {
      href: link.href,
      status: 'DOWNLOADED',
      filename: downloaded.filename,
      fileHash: downloaded.hash,
      byteSize: downloaded.size,
    }
  }

  try {
    const asset = await ctx.hygraph.uploadFile({
      filePath: downloaded.filePath,
      fileName: downloaded.filename,
      mimeType: downloaded.mimeType,
    })
    await lock(() => {
      ctx.store.saveAsset({
        fileHash: downloaded.hash,
        originalUrl: link.href,
        wpMediaId: media.id,
        filename: downloaded.filename,
        mimeType: downloaded.mimeType,
        byteSize: downloaded.size,
        hygraphAssetId: asset.id,
        hygraphUrl: asset.url,
      })
      ctx.store.upsertLink({
        ...base,
        filename: downloaded.filename,
        fileHash: downloaded.hash,
        wpMediaId: media.id,
        hygraphAssetId: asset.id,
        hygraphUrl: asset.url,
        status: 'UPLOADED',
        reused: 0,
      })
    })
    return {
      href: link.href,
      hygraphUrl: asset.url,
      hygraphAssetId: asset.id,
      status: 'UPLOADED',
      filename: downloaded.filename,
      fileHash: downloaded.hash,
      byteSize: downloaded.size,
    }
  } catch (error) {
    await write({
      filename: downloaded.filename,
      fileHash: downloaded.hash,
      wpMediaId: media.id,
      hygraphAssetId: error.assetId || null,
      status: 'FAILED',
      failureStage: 'upload',
      errorMessage: errorText(error),
      reused: 0,
    })
    return { href: link.href, error: errorText(error), status: 'FAILED', filename: downloaded.filename }
  }
}

function linkRow(school, prior, originalUrl, hygraphUrl, status, failureStage, errorMessage) {
  return {
    schoolId: school.id,
    schoolName: school.schoolName,
    schoolYear: school.schoolYear,
    fieldName: prior?.field_name,
    originalUrl,
    linkText: prior?.link_text,
    filename: prior?.filename,
    fileHash: prior?.file_hash,
    wpMediaId: prior?.wp_media_id,
    hygraphAssetId: prior?.hygraph_asset_id,
    hygraphUrl,
    status,
    reused: prior?.reused === 1,
    failureStage: failureStage || null,
    errorMessage: errorMessage || null,
  }
}

function hrefsIn(raw) {
  const hrefs = new Set()
  walkRichText(raw, (node) => {
    if (node.type === 'link' && typeof node.href === 'string') hrefs.add(node.href)
  })
  return hrefs
}

async function confirmSavedContent(schoolId, pending, ctx) {
  let lastErrors = ['confirmation did not run']
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 1500))
    const confirmed = await ctx.hygraph.getSchool(
      schoolId,
      pending.map((item) => item.fieldName),
      'DRAFT'
    )
    lastErrors = []
    for (const item of pending) {
      const errors = diffContent(item.raw, confirmed?.[item.fieldName]?.raw, item.replacements)
      if (errors.length) lastErrors.push(`${item.fieldName}: ${errors.slice(0, 2).join('; ')}`)
    }
    if (!lastErrors.length) return confirmed
  }
  throw new Error(`Saved content did not verify: ${lastErrors.slice(0, 3).join('; ')}`)
}

function reconcileMigratedLinks(school, ctx) {
  const rows = ctx.store.listLinks().filter((row) => row.school_id === school.id && row.hygraph_url && row.status !== 'VERIFIED')
  let reconciled = 0
  for (const fieldName of ctx.fields) {
    const raw = school[fieldName]?.raw
    if (!raw) continue
    const hrefs = hrefsIn(raw)
    const remaining = new Set(findWordPressLinks(raw).map((link) => link.href))
    for (const row of rows.filter((row) => row.field_name === fieldName)) {
      if (!hrefs.has(row.hygraph_url) || remaining.has(row.original_url)) continue
      ctx.store.upsertLink({
        schoolId: school.id,
        schoolName: school.schoolName,
        schoolYear: school.schoolYear,
        fieldName: row.field_name,
        originalUrl: row.original_url,
        linkText: row.link_text,
        filename: row.filename,
        fileHash: row.file_hash,
        wpMediaId: row.wp_media_id,
        hygraphAssetId: row.hygraph_asset_id,
        hygraphUrl: row.hygraph_url,
        status: 'VERIFIED',
        reused: row.reused === 1,
      })
      reconciled += 1
    }
  }
  return reconciled
}
function backupField(config, store, schoolId, fieldName, raw) {
  const directory = path.join(config.backupDir, schoolId)
  fs.mkdirSync(directory, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filePath = path.join(directory, `${stamp}-${fieldName}.json`)
  fs.writeFileSync(filePath, JSON.stringify(raw))
  store.backup(schoolId, fieldName, raw)
  return filePath
}

async function processSchool(summary, ctx) {
  const school = await ctx.hygraph.getSchool(summary.id, ctx.fields, 'DRAFT')
  if (!school) throw new Error(`School ${summary.id} was not found`)
  const notes = []
  const resolved = []
  const pending = []

  for (const fieldName of ctx.fields) {
    const raw = school[fieldName]?.raw
    if (!raw) continue
    const plainText = findPlainTextWordPressUrls(raw)
    if (plainText.length) {
      notes.push(`${fieldName} contains ${plainText.length} WordPress URL(s) in text, left unchanged`)
    }
    const links = findWordPressLinks(raw)
    const results = await mapPooled(links, ctx.config.concurrency, (link, lock) =>
      resolveLink(school, fieldName, link, ctx, lock)
    )
    resolved.push(...results.map((result) => ({ ...result, fieldName })))
    if (ctx.log) {
      for (const result of results) {
        const label = result.filename || result.href
        const detail = result.hygraphUrl || result.status
        ctx.log(
          `${school.schoolYear || '-'} ${school.schoolName}: ${label} -> ${detail}${result.reused ? ' (reused)' : ''}${result.error ? ` (${result.error})` : ''}`
        )
      }
    }
    if (ctx.identifyOnly || ctx.dryRun) continue
    const replacements = new Map()
    for (const result of results) {
      if (result.hygraphUrl) replacements.set(result.href, result.hygraphUrl)
    }
    if (replacements.size) pending.push({ fieldName, raw, replacements })
  }

  let updateStatus = ctx.dryRun ? 'dry-run' : ctx.identifyOnly ? 'scanned' : 'unchanged'
  let updateError = null
  if (pending.length && !ctx.dryRun && !ctx.identifyOnly) {
    const updates = {}
    for (const item of pending) {
      backupField(ctx.config, ctx.store, school.id, item.fieldName, item.raw)
      updates[item.fieldName] = compactRichText(replaceLinkHrefs(item.raw, item.replacements).raw)
    }
    try {
      const updated = await ctx.hygraph.updateSchoolRichText(school.id, updates)
      for (const item of pending) {
        const returned = updated?.[item.fieldName]?.raw
        const returnedErrors = diffContent(item.raw, returned, item.replacements)
        if (returnedErrors.length) {
          throw new Error(`Updated ${item.fieldName} did not match the source document: ${returnedErrors.slice(0, 3).join('; ')}`)
        }
      }
      await confirmSavedContent(school.id, pending, ctx)
      for (const item of pending) {
        for (const [originalUrl, hygraphUrl] of item.replacements) {
          const prior = ctx.store.getLink(school.id, item.fieldName, originalUrl)
          ctx.store.upsertLink(linkRow(school, { ...prior, field_name: item.fieldName }, originalUrl, hygraphUrl, 'VERIFIED'))
        }
      }
      updateStatus = 'updated'
    } catch (error) {
      updateError = errorText(error)
      updateStatus = 'failed'
      for (const item of pending) {
        for (const [originalUrl, hygraphUrl] of item.replacements) {
          const prior = ctx.store.getLink(school.id, item.fieldName, originalUrl)
          ctx.store.upsertLink({
            schoolId: school.id,
            schoolName: school.schoolName,
            schoolYear: school.schoolYear,
            fieldName: item.fieldName,
            originalUrl,
            linkText: prior?.link_text,
            filename: prior?.filename,
            fileHash: prior?.file_hash,
            wpMediaId: prior?.wp_media_id,
            hygraphAssetId: prior?.hygraph_asset_id,
            hygraphUrl,
            status: 'FAILED',
            failureStage: 'update',
            errorMessage: updateError,
            reused: prior?.reused === 1,
          })
        }
      }
    }
  }

  const unresolved = resolved.filter((link) => !link.hygraphUrl)
  if (!ctx.dryRun && !ctx.identifyOnly && unresolved.length && updateStatus === 'updated') {
    updateStatus = 'partial'
  }
  if (!ctx.dryRun && !ctx.identifyOnly && unresolved.length && updateStatus === 'unchanged') {
    updateStatus = 'incomplete'
  }
  if (!ctx.dryRun && !ctx.identifyOnly && updateStatus !== 'failed') {
    const reconciled = reconcileMigratedLinks(school, ctx)
    if (reconciled && (updateStatus === 'unchanged' || updateStatus === 'incomplete')) updateStatus = 'updated'
  }
  const changedDraft = updateStatus === 'updated' || updateStatus === 'partial'
  if (ctx.config.publishSchools && !ctx.dryRun && !ctx.identifyOnly && updateStatus !== 'failed') {
    let publishThisSchool = changedDraft
    if (!publishThisSchool) {
      const draftWordPressLinks = ctx.fields.reduce(
        (count, fieldName) => count + findWordPressLinks(school[fieldName]?.raw).length,
        0
      )
      if (draftWordPressLinks === 0) {
        const published = await ctx.hygraph.getSchool(school.id, ctx.fields, 'PUBLISHED')
        const publishedWordPressLinks = ctx.fields.reduce(
          (count, fieldName) => count + findWordPressLinks(published?.[fieldName]?.raw).length,
          0
        )
        publishThisSchool = publishedWordPressLinks > 0
      }
    }
    if (publishThisSchool) {
      try {
        if (ctx.log) ctx.log(`Publishing ${school.schoolName}...`)
        await ctx.hygraph.publishSchool(school.id)
        updateStatus = unresolved.length ? 'published-partial' : 'published'
      } catch (error) {
        updateError = errorText(error)
        updateStatus = 'publish-failed'
      }
    }
  }
  const draftRemaining = ctx.fields.reduce((count, fieldName) => {
    return count + findWordPressLinks(school[fieldName]?.raw).length
  }, 0)
  ctx.store.upsertSchool({
    schoolId: school.id,
    schoolName: school.schoolName,
    schoolYear: school.schoolYear,
    slug: school.slug,
    updateStatus,
    remainingWpUrls:
      updateStatus === 'updated' || updateStatus === 'published'
        ? 0
        : updateStatus === 'published-partial'
          ? unresolved.length
          : ctx.dryRun || ctx.identifyOnly
            ? draftRemaining
            : unresolved.length,
    errorMessage: updateError,
  })

  return {
    id: school.id,
    name: school.schoolName,
    year: school.schoolYear,
    slug: school.slug,
    updateStatus,
    updateError,
    notes,
    links: resolved,
  }
}

async function runMigration(options, ctx) {
  const fields = await ctx.hygraph.richTextFields()
  const schools = selectSchools(await ctx.hygraph.listSchools(), options)
  if (options.id && schools.length === 0) {
    throw new Error(`No school found for ${options.id}`)
  }
  const runId = ctx.store.startRun(options.command, Boolean(options.dryRun || options.identifyOnly))
  const state = {
    ...ctx,
    fields,
    dryRun: Boolean(options.dryRun),
    identifyOnly: Boolean(options.identifyOnly),
    command: options.command,
  }
  const results = []
  for (const school of schools) {
    results.push(await processSchool(school, state))
  }
  const schoolsUpdated = results.filter((result) => result.updateStatus === 'updated' || result.updateStatus === 'published').length
  ctx.store.finishRun(runId, { schoolsScanned: results.length, schoolsUpdated })
  return { schools: results, fields, report: ctx.store.report() }
}

async function verifyMigration(options, ctx) {
  const fields = await ctx.hygraph.richTextFields()
  const schools = selectSchools(await ctx.hygraph.listSchools(), options)
  const results = []
  for (const summary of schools) {
    const draft = await ctx.hygraph.getSchool(summary.id, fields, 'DRAFT')
    const published = await ctx.hygraph.getSchool(summary.id, fields, 'PUBLISHED')
    const count = (school) =>
      fields.reduce((total, fieldName) => total + findWordPressLinks(school?.[fieldName]?.raw).length, 0)
    results.push({
      id: summary.id,
      name: summary.schoolName,
      year: summary.schoolYear,
      draftWordPressUrls: count(draft),
      publishedWordPressUrls: count(published),
    })
  }
  return { schools: results, report: ctx.store.report() }
}

module.exports = {
  selectSchools,
  resolveLink,
  processSchool,
  runMigration,
  verifyMigration,
  diffContent,
}
