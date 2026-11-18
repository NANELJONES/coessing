const fs = require('fs')
const os = require('os')
const path = require('path')
const { loadConfig, parseYears } = require('./config')
const { openStore } = require('./store')
const { createHygraph } = require('./hygraph')
const { createWordPress } = require('./wordpress')
const { runMigration, verifyMigration } = require('./engine')
const { inspectDownload } = require('./files')
const { formatReport, formatSchoolResult } = require('./report')

try {
  process.stdout._handle?.setBlocking?.(true)
} catch {
  // Progress logs stay line-buffered when the handle cannot be changed.
}

const HELP = `
Coessing WordPress to Hygraph media migration

The default scope is school years 2023 and 2024.
School entries are updated as drafts. Publishing stays off unless --publish-schools is passed.

Commands:
  scan               List WordPress media links in school rich text
  preview            Same scan, printed as a migration preview
  dry-run            Download and validate files without uploading or editing Hygraph
  migrate            Upload files and replace draft rich text URLs
  resume             Continue a migration, reusing uploaded assets
  verify             Re-read draft and published schools and count remaining WordPress URLs
  report             Print the saved migration report
  test-connections   Check WordPress, download one PDF and one image, and read Hygraph

Options:
  --id <id-or-slug>  Limit the run to one school
  --years 2023,2024  Years to include, or "all"
  --publish-assets   Publish a new asset only if its public URL is not readable
  --publish-schools  Publish School drafts after a verified update
`.trim()

function parseArgs(argv) {
  const [command = 'help', ...rest] = argv
  const options = {
    command,
    id: null,
    yearsSet: false,
    yearsValue: undefined,
    publishSchools: false,
    publishAssets: false,
  }
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index]
    const [flag, inline] = arg.startsWith('--') && arg.includes('=') ? [arg.slice(0, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)] : [arg, undefined]
    if (flag === '--id') options.id = inline === undefined ? rest[++index] : inline
    else if (flag === '--years') {
      options.yearsSet = true
      options.yearsValue = inline === undefined ? rest[++index] : inline
    } else if (flag === '--publish-schools') options.publishSchools = true
    else if (arg === '--publish-assets') options.publishAssets = true
    else if (arg === '--help' || arg === '-h') options.command = 'help'
    else throw new Error(`Unknown argument: ${arg}`)
  }
  return options
}

function printResults(results) {
  if (!results.schools.length) {
    console.log('No schools matched this scope.')
    return
  }
  for (const school of results.schools) console.log(formatSchoolResult(school))
  console.log('')
  console.log(formatReport(results.report))
}

async function testConnections(config) {
  const wordpress = createWordPress({ ...config, delayMs: 0 })
  const index = await fetch(`${config.wpUrl}/wp-json/`, {
    headers: { accept: 'application/json', 'user-agent': 'coessing-media-migration' },
    signal: AbortSignal.timeout(30000),
  })
  if (!index.ok) throw new Error(`WordPress API returned HTTP ${index.status}`)
  const site = await index.json()
  console.log(`WordPress API: HTTP ${index.status} ${site.name || 'connected'}`)

  const pdfRecords = await wordpress.searchMedia('coessing24_schedule')
  const pdf = pdfRecords.find((record) => (record.mime_type || '').includes('pdf'))
  if (!pdf) throw new Error('WordPress PDF search returned no schedule PDF')
  const pdfDownload = await wordpress.download(pdf, path.join(os.tmpdir(), 'coessing-migration-test'))
  console.log(`PDF download: ${pdfDownload.filename} ${pdfDownload.size} bytes ${pdfDownload.mimeType}`)

  const imageResponse = await fetch(`${config.wpUrl}/wp-json/wp/v2/media?media_type=image&per_page=1`, {
    headers: { accept: 'application/json', 'user-agent': 'coessing-media-migration' },
    signal: AbortSignal.timeout(30000),
  })
  if (!imageResponse.ok) throw new Error(`WordPress image search returned HTTP ${imageResponse.status}`)
  const images = await imageResponse.json()
  if (!Array.isArray(images) || !images[0]) throw new Error('WordPress image search returned no image')
  const imageDownload = await wordpress.download(images[0], path.join(os.tmpdir(), 'coessing-migration-test'))
  const header = Buffer.alloc(16)
  const handle = await fs.promises.open(imageDownload.filePath, 'r')
  await handle.read(header, 0, 16, 0)
  await handle.close()
  const inspection = inspectDownload({
    buffer: header,
    extension: imageDownload.extension,
    mimeType: imageDownload.mimeType,
    size: imageDownload.size,
  })
  if (!inspection.ok) throw new Error(inspection.reason)
  console.log(`Image download: ${imageDownload.filename} ${imageDownload.size} bytes ${imageDownload.mimeType}`)
  fs.rmSync(pdfDownload.filePath, { force: true })
  fs.rmSync(imageDownload.filePath, { force: true })

  const hygraph = createHygraph({ ...config, delayMs: 0 })
  const fields = await hygraph.richTextFields()
  const schools = await hygraph.listSchools()
  console.log(`Hygraph read: ${schools.length} schools, rich text fields: ${fields.join(', ')}`)
  console.log('Hygraph asset upload is exercised by migrate, after a dry run.')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.command === 'help') {
    console.log(HELP)
    return
  }
  const config = loadConfig({
    years: options.yearsSet ? parseYears(options.yearsValue) : undefined,
    publishSchools: options.publishSchools,
    publishAssets: options.publishAssets,
  })
  const years = options.yearsSet ? parseYears(options.yearsValue) : config.years
  const runOptions = {
    command: options.command,
    id: options.id,
    years,
    dryRun: options.command === 'dry-run',
    identifyOnly: options.command === 'scan' || options.command === 'preview',
  }
  if (!['scan', 'preview', 'dry-run', 'migrate', 'resume', 'verify', 'report', 'test-connections'].includes(options.command)) {
    throw new Error(`Unknown command: ${options.command}`)
  }

  const yearLabel = years ? years.join(', ') : 'all'
  console.log(`Scope: ${options.id || `years ${yearLabel}`}. Draft updates only${config.publishSchools ? ', and school publishing is enabled' : ''}.`)

  if (options.command === 'test-connections') {
    await testConnections(config)
    return
  }

  const store = openStore(config.dbPath)
  try {
    if (options.command === 'report') {
      console.log(formatReport(store.report()))
      return
    }
    const ctx = {
      config,
      store,
      hygraph: createHygraph(config),
      wordpress: createWordPress(config),
      log: (message) => console.log(message),
    }
    if (options.command === 'verify') {
      const results = await verifyMigration(runOptions, ctx)
      for (const school of results.schools) {
        console.log(
          `${school.year || '-'} ${school.name}: draft WordPress links ${school.draftWordPressUrls}, published WordPress links ${school.publishedWordPressUrls}`
        )
      }
      console.log('')
      console.log(formatReport(results.report))
      return
    }
    const results = await runMigration(runOptions, ctx)
    printResults(results)
    const updatedNow = results.schools.some((school) => school.updateStatus === 'updated' || school.updateStatus === 'published')
    const publishedNow = results.schools.some((school) => school.updateStatus === 'published' || school.updateStatus === 'published-partial')
    if (!runOptions.dryRun && !runOptions.identifyOnly && publishedNow) {
      console.log('')
      console.log('Verified school updates were published.')
    } else if (!runOptions.dryRun && !runOptions.identifyOnly && updatedNow) {
      console.log('')
      console.log('School drafts were updated where a file was verified. Published entries were left unchanged.')
    }
  } finally {
    store.close()
  }
}

main().catch((error) => {
  console.error(error.message || 'Migration command failed')
  process.exitCode = 1
})
