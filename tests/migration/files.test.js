const test = require('node:test')
const assert = require('node:assert/strict')
const { inspectDownload } = require('../../scripts/migration/files')

test('accepts a PDF header and rejects an HTML error page', () => {
  const pdf = inspectDownload({
    buffer: Buffer.from('%PDF-1.7\n'),
    extension: 'pdf',
    mimeType: 'application/pdf',
    size: 20,
    expectedSize: 20,
  })
  assert.equal(pdf.ok, true)

  const html = inspectDownload({
    buffer: Buffer.from('<!DOCTYPE html><html>'),
    extension: 'pdf',
    mimeType: 'text/html',
    size: 40,
  })
  assert.equal(html.ok, false)

  const jpeg = inspectDownload({
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    extension: 'jpg',
    mimeType: 'image/jpeg',
    size: 4,
  })
  assert.equal(jpeg.ok, true)
})

test('rejects a file whose size does not match WordPress', () => {
  const result = inspectDownload({
    buffer: Buffer.from('%PDF-1.7'),
    extension: 'pdf',
    mimeType: 'application/pdf',
    size: 10,
    expectedSize: 99,
  })
  assert.equal(result.ok, false)
})
