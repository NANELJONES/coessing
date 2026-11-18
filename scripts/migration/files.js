const MIME_BY_EXTENSION = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  txt: 'text/plain',
  mp4: 'video/mp4',
  zip: 'application/zip',
}

function startsWithHtml(buffer) {
  const head = buffer.slice(0, 64).toString('utf8').trim().toLowerCase()
  return head.startsWith('<!doctype html') || head.startsWith('<html') || head.startsWith('<head')
}

function magicMatches(buffer, extension) {
  if (buffer.length < 4) return false
  if (extension === 'pdf') return buffer.subarray(0, 4).toString('utf8') === '%PDF'
  if (extension === 'png') return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
  if (extension === 'jpg' || extension === 'jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  if (extension === 'gif') return buffer.subarray(0, 3).toString('utf8') === 'GIF'
  if (extension === 'webp') return buffer.subarray(0, 4).toString('utf8') === 'RIFF'
  if (['docx', 'xlsx', 'pptx', 'zip'].includes(extension)) return buffer[0] === 0x50 && buffer[1] === 0x4b
  if (extension === 'doc' || extension === 'ppt' || extension === 'xls') {
    const ole = buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0
    const zip = buffer[0] === 0x50 && buffer[1] === 0x4b
    return ole || zip
  }
  if (extension === 'svg') return buffer.slice(0, 200).toString('utf8').toLowerCase().includes('<svg')
  return buffer.length > 0 && !startsWithHtml(buffer)
}

function mimeAgrees(extension, mimeType) {
  if (!mimeType) return true
  const normalized = mimeType.split(';')[0].trim().toLowerCase()
  if (!normalized || normalized === 'application/octet-stream' || normalized === 'binary/octet-stream') return true
  const expected = MIME_BY_EXTENSION[extension]
  if (!expected) return !normalized.startsWith('text/html')
  if (expected === normalized) return true
  if (extension === 'zip' && /zip|compressed/.test(normalized)) return true
  if (['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(extension) && /powerpoint|wordprocessing|msword|excel|spreadsheet|officedocument|ms-/.test(normalized)) {
    return true
  }
  return false
}

function inspectDownload({ buffer, extension, mimeType, size, expectedSize }) {
  if (!size || size < 1) return { ok: false, reason: 'Downloaded file is empty' }
  if (startsWithHtml(buffer)) return { ok: false, reason: 'Downloaded an HTML page instead of the media file' }
  if (mimeType && mimeType.toLowerCase().includes('text/html')) {
    return { ok: false, reason: 'Response content type is HTML' }
  }
  if (extension && !magicMatches(buffer, extension)) {
    return { ok: false, reason: `File header does not match .${extension}` }
  }
  if (extension && !mimeAgrees(extension, mimeType)) {
    return { ok: false, reason: `MIME type ${mimeType} does not match .${extension}` }
  }
  if (expectedSize && Number(expectedSize) !== Number(size)) {
    return { ok: false, reason: `File size ${size} does not match WordPress size ${expectedSize}` }
  }
  return { ok: true, mimeType: mimeType || MIME_BY_EXTENSION[extension] || 'application/octet-stream' }
}

module.exports = {
  MIME_BY_EXTENSION,
  inspectDownload,
  magicMatches,
}
