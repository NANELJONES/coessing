const test = require('node:test')
const assert = require('node:assert/strict')
const { extractExtension, extractFilename, isWordPressMediaUrl, uploadsPath } = require('../../scripts/migration/urls')

test('recognizes Coessing WordPress upload URLs and ignores other links', () => {
  assert.equal(isWordPressMediaUrl('https://www.coessing.org/wp-content/uploads/2022/08/data-exclusivity-for-africa.pdf'), true)
  assert.equal(isWordPressMediaUrl('https://coessing.org/wp-content/uploads/2024/09/coessing24_schedule.pdf'), true)
  assert.equal(isWordPressMediaUrl('http://coessing.wpcomstaging.com/wp-content/uploads/2023/07/updated-online-schedule-.pdf'), true)
  assert.equal(isWordPressMediaUrl('https://coessing.org/about'), false)
  assert.equal(isWordPressMediaUrl('https://science.jpl.nasa.gov/people/example/'), false)
  assert.equal(isWordPressMediaUrl('https://example.com/wp-content/uploads/2024/09/file.pdf'), false)
  assert.equal(isWordPressMediaUrl('not a url'), false)
})

test('extracts the original filename and extension', () => {
  const url = 'https://coessing.org/wp-content/uploads/2023/07/updated-online-schedule-.pdf'
  assert.equal(extractFilename(url), 'updated-online-schedule-.pdf')
  assert.equal(extractExtension(extractFilename(url)), 'pdf')
  assert.equal(uploadsPath(url), '/wp-content/uploads/2023/07/updated-online-schedule-.pdf')
  assert.equal(extractFilename('https://www.coessing.org/wp-content/uploads/2022/08/data-exclusivity-for-africa.pdf'), 'data-exclusivity-for-africa.pdf')
})
