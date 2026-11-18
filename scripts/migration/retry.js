class HttpError extends Error {
  constructor(message, status, options = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.retryable = options.retryable
  }
}

function isRetryable(error) {
  if (!error) return false
  if (error.retryable === true) return true
  if (error.retryable === false) return false
  const status = error.status || error.statusCode
  if (status && [408, 425, 429, 500, 502, 503, 504].includes(status)) return true
  if (status && status >= 400 && status < 500) return false
  if (['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN'].includes(error.code)) return true
  if (error.name === 'AbortError' || error.name === 'TimeoutError') return true
  if (error.name === 'TypeError' && /fetch|network/i.test(error.message || '')) return true
  return false
}

async function withRetry(fn, options = {}) {
  const retries = options.retries ?? 3
  const baseDelayMs = options.baseDelayMs ?? 400
  const sleep = options.sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))
  const shouldRetry = options.shouldRetry || isRetryable
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn(attempt)
    } catch (error) {
      lastError = error
      if (attempt === retries || !shouldRetry(error)) throw error
      await sleep(baseDelayMs * 3 ** attempt)
    }
  }
  throw lastError
}

module.exports = {
  HttpError,
  isRetryable,
  withRetry,
}
