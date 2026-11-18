const test = require('node:test')
const assert = require('node:assert/strict')
const { selectMediaRecord } = require('../../scripts/migration/wordpress')

const original = 'https://www.coessing.org/wp-content/uploads/2024/09/coessing24_schedule.pdf'

function record(path, extras = {}) {
  return {
    id: extras.id || 1,
    mime_type: extras.mime || 'application/pdf',
    source_url: `https://coessing.wpcomstaging.com${path}`,
    slug: extras.slug || 'coessing24_schedule',
    date: extras.date || '2024-09-01T00:00:00',
    media_details: { filesize: 100 },
  }
}

test('matches the staging media record by upload path rather than host', () => {
  const selected = selectMediaRecord(
    [
      record('/wp-content/uploads/2020/01/coessing24_schedule.pdf', { id: 10 }),
      record('/wp-content/uploads/2024/09/coessing24_schedule.pdf', { id: 2872 }),
    ],
    original
  )
  assert.equal(selected.record.id, 2872)
})

test('does not accept the same filename from another upload month', () => {
  const selected = selectMediaRecord(
    [record('/wp-content/uploads/2020/01/coessing24_schedule.pdf', { id: 10 })],
    original
  )
  assert.equal(selected.record, undefined)
  assert.equal(selected.error, 'path_mismatch')
})

test('reports an ambiguous match when the same path has conflicting types', () => {
  const selected = selectMediaRecord(
    [
      record('/wp-content/uploads/2024/09/coessing24_schedule.pdf', { id: 1, mime: 'application/pdf' }),
      record('/wp-content/uploads/2024/09/coessing24_schedule.pdf', { id: 2, mime: 'image/jpeg' }),
    ],
    original
  )
  assert.equal(selected.error, 'ambiguous')
  assert.equal(selected.candidates.length, 2)
})
