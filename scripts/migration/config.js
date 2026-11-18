const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.join(__dirname, '..', '..')

function loadDotEnv(root = PROJECT_ROOT) {
  const envPath = path.join(root, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue
    const index = line.indexOf('=')
    const key = line.slice(0, index).trim()
    if (!key || process.env[key] !== undefined) continue
    let value = line.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function parseYears(value) {
  if (value === undefined || value === null || value === '') return [2023, 2024]
  if (value === 'all') return null
  return String(value)
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((year) => Number.isInteger(year))
}

function loadConfig(overrides = {}) {
  loadDotEnv()
  const endpoint = process.env.HYGRAPH_ENDPOINT || process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT
  const token = process.env.HYGRAPH_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN
  if (!endpoint) {
    throw new Error('Missing HYGRAPH_ENDPOINT or NEXT_PUBLIC_GRAPHCMS_ENDPOINT')
  }
  if (!token) {
    throw new Error('Missing HYGRAPH_TOKEN or NEXT_PUBLIC_API_TOKEN')
  }

  const dataDir = path.resolve(overrides.dataDir || process.env.MIGRATION_DATA_DIR || path.join(PROJECT_ROOT, 'migration-data'))
  return {
    projectRoot: PROJECT_ROOT,
    endpoint,
    token,
    wpUrl: (overrides.wpUrl || process.env.WP_URL || 'https://coessing.wpcomstaging.com').replace(/\/$/, ''),
    wpUsername: process.env.WP_USERNAME || '',
    wpAppPassword: process.env.WP_APP_PASSWORD || '',
    dataDir,
    dbPath: path.join(dataDir, 'migration.sqlite'),
    backupDir: path.join(dataDir, 'backups'),
    downloadDir: path.join(dataDir, 'downloads'),
    years: overrides.years === undefined ? parseYears(process.env.MIGRATION_YEARS) : overrides.years,
    delayMs: Number(process.env.MIGRATION_DELAY_MS || 300),
    retries: Number(process.env.MIGRATION_RETRIES || 3),
    concurrency: Math.max(1, Number(process.env.MIGRATION_CONCURRENCY || 1)),
    publishSchools: overrides.publishSchools === true || process.env.MIGRATION_PUBLISH_SCHOOLS === 'true',
    publishAssets: overrides.publishAssets === true || process.env.MIGRATION_PUBLISH_ASSETS === 'true',
  }
}

module.exports = {
  PROJECT_ROOT,
  loadDotEnv,
  loadConfig,
  parseYears,
}
