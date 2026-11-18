const test = require('node:test')
const assert = require('node:assert/strict')
const { HttpError, withRetry } = require('../../scripts/migration/retry')

test('retries a temporary network failure and then succeeds', async () => {
  let attempts = 0
  const value = await withRetry(
    async () => {
      attempts += 1
      if (attempts < 3) throw new HttpError('unavailable', 503)
      return 'ok'
    },
    { retries: 3, baseDelayMs: 1, sleep: async () => {} }
  )
  assert.equal(value, 'ok')
  assert.equal(attempts, 3)
})

test('does not retry a missing file', async () => {
  let attempts = 0
  await assert.rejects(
    () =>
      withRetry(
        async () => {
          attempts += 1
          throw new HttpError('missing', 404)
        },
        { retries: 3, baseDelayMs: 1, sleep: async () => {} }
      ),
    /missing/
  )
  assert.equal(attempts, 1)
})
