const WORDPRESS_HOSTS = new Set(['coessing.org', 'coessing.wpcomstaging.com'])

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function parseUrl(value) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isWordPressMediaUrl(value) {
  const url = parseUrl(value)
  if (!url) return false
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (!WORDPRESS_HOSTS.has(host)) return false
  return safeDecode(url.pathname).toLowerCase().includes('/wp-content/uploads/')
}

function uploadsPath(value) {
  const url = parseUrl(value)
  if (!url) return null
  const pathname = safeDecode(url.pathname)
  const index = pathname.toLowerCase().indexOf('/wp-content/uploads/')
  if (index === -1) return null
  return pathname.slice(index)
}

function extractFilename(value) {
  const uploads = uploadsPath(value)
  if (!uploads) return null
  const name = uploads.split('/').filter(Boolean).pop()
  return name || null
}

function extractExtension(filename) {
  if (!filename) return ''
  const base = String(filename).split(/[?#]/)[0]
  const dot = base.lastIndexOf('.')
  if (dot <= 0 || dot === base.length - 1) return ''
  return base.slice(dot + 1).toLowerCase()
}

function toWordPressDownloadUrl(sourceUrl, wpUrl) {
  const source = parseUrl(sourceUrl)
  const base = parseUrl(wpUrl)
  if (!source || !base) return sourceUrl
  if (!safeDecode(source.pathname).toLowerCase().includes('/wp-content/uploads/')) return sourceUrl
  return `${base.origin}${source.pathname}${source.search}`
}

module.exports = {
  WORDPRESS_HOSTS,
  isWordPressMediaUrl,
  uploadsPath,
  extractFilename,
  extractExtension,
  toWordPressDownloadUrl,
}
