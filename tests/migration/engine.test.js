const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { openStore } = require('../../scripts/migration/store')
const { runMigration } = require('../../scripts/migration/engine')
const { findWordPressLinks } = require('../../scripts/migration/richtext')

const WP_URL = 'https://coessing.org/wp-content/uploads/2024/09/coessing24_schedule.pdf'
const ASSET_URL = 'https://ap-south-1.graphassets.com/migrated-schedule'

function richText() {
  return {
    children: [
      { type: 'heading-one', children: [{ text: 'Schedule' }] },
      {
        type: 'paragraph',
        children: [
          { text: 'Download ' },
          {
            type: 'link',
            href: WP_URL,
            title: 'Schedule',
            openInNewTab: false,
            children: [{ text: 'the schedule', bold: true }],
          },
          { text: ' or visit ' },
          {
            type: 'link',
            href: 'https://science.jpl.nasa.gov/people/example/',
            openInNewTab: false,
            children: [{ text: 'JPL' }],
          },
        ],
      },
      {
        type: 'image',
        src: 'https://ap-south-1.graphassets.com/keep',
        title: 'Cover',
        handle: 'handle',
        width: 100,
        height: 80,
        mimeType: 'image/jpeg',
        children: [{ text: '' }],
      },
    ],
  }
}

function harness(options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'coessing-engine-'))
  const store = openStore(path.join(dir, 'migration.sqlite'))
  const documents = new Map([['s1', richText()]])
  if (options.secondSchool) documents.set('s2', richText())
  const calls = { uploads: 0, updates: 0, downloads: 0, finds: 0, published: 0 }
  const names = { s1: ['COESSING 2024', 2024], s2: ['COESSING 2023', 2023] }
  const ctx = {
    config: {
      downloadDir: path.join(dir, 'downloads'),
      backupDir: path.join(dir, 'backups'),
      concurrency: 1,
      publishSchools: false,
    },
    store,
    hygraph: {
      async richTextFields() {
        return ['schoolDetails']
      },
      async listSchools() {
        return [...documents.keys()].map((id) => ({
          id,
          schoolName: names[id][0],
          schoolYear: names[id][1],
          slug: id,
          schoolType: 'coessing',
        }))
      },
      async getSchool(id) {
        const raw = documents.get(id)
        if (!raw) return null
        return {
          id,
          schoolName: names[id][0],
          schoolYear: names[id][1],
          slug: id,
          schoolDetails: { raw: structuredClone(raw) },
        }
      },
      async updateSchoolRichText(id, updates) {
        calls.updates += 1
        documents.set(id, structuredClone(updates.schoolDetails))
        return { id, schoolDetails: { raw: structuredClone(documents.get(id)) } }
      },
      async uploadFile() {
        calls.uploads += 1
        return { id: 'asset-1', url: ASSET_URL, fileName: 'coessing24_schedule.pdf', mimeType: 'application/pdf' }
      },
      async publishSchool() {
        calls.published += 1
        throw new Error('schools must not be published automatically')
      },
    },
    wordpress: {
      async findMedia() {
        calls.finds += 1
        if (options.failFind) {
          const error = new Error('WordPress media record was not found')
          error.code = 'not_found'
          throw error
        }
        return {
          id: 2872,
          mime_type: 'application/pdf',
          source_url: 'https://coessing.wpcomstaging.com/wp-content/uploads/2024/09/coessing24_schedule.pdf',
          ...(options.media || {}),
        }
      },
      async download() {
        calls.downloads += 1
        if (options.failDownload) {
          const error = new Error('temporary network failure')
          error.status = 503
          throw error
        }
        return {
          filePath: path.join(dir, 'file.pdf'),
          filename: 'coessing24_schedule.pdf',
          extension: 'pdf',
          hash: 'abc123',
          size: 120,
          mimeType: 'application/pdf',
        }
      },
    },
  }
  return { ctx, calls, documents, store, dir }
}

test('dry run downloads a file and does not upload or edit Hygraph', async () => {
  const { ctx, calls, documents, store } = harness()
  const results = await runMigration({ command: 'dry-run', years: [2023, 2024], dryRun: true }, ctx)
  assert.equal(calls.uploads, 0)
  assert.equal(calls.updates, 0)
  assert.equal(calls.published, 0)
  assert.equal(calls.downloads, 1)
  assert.equal(results.schools[0].updateStatus, 'dry-run')
  assert.equal(findWordPressLinks(documents.get('s1')).length, 1)
  assert.equal(store.getLink('s1', 'schoolDetails', WP_URL).status, 'DOWNLOADED')
  store.close()
})

test('migration uploads once, preserves unrelated nodes, and can resume', async () => {
  const { ctx, calls, documents, store } = harness()
  const first = await runMigration({ command: 'migrate', years: [2024], id: 's1' }, ctx)
  assert.equal(calls.uploads, 1)
  assert.equal(calls.updates, 1)
  assert.equal(calls.published, 0)
  assert.equal(first.schools[0].updateStatus, 'updated')
  const saved = documents.get('s1')
  assert.equal(findWordPressLinks(saved).length, 0)
  assert.equal(saved.children[1].children[1].href, ASSET_URL)
  assert.equal(saved.children[1].children[1].children[0].text, 'the schedule')
  assert.equal(saved.children[1].children[1].children[0].bold, true)
  assert.equal(saved.children[1].children[3].href, 'https://science.jpl.nasa.gov/people/example/')
  assert.equal(saved.children[2].src, 'https://ap-south-1.graphassets.com/keep')
  assert.equal(store.getLink('s1', 'schoolDetails', WP_URL).status, 'VERIFIED')
  assert.equal(fs.readdirSync(path.join(ctx.config.backupDir, 's1')).length > 0, true)

  const second = await runMigration({ command: 'resume', years: [2024], id: 's1' }, ctx)
  assert.equal(calls.uploads, 1)
  assert.equal(calls.updates, 1)
  assert.equal(second.schools[0].links.length, 0)
  store.close()
})

test('reuses one Hygraph asset when two schools reference the same file', async () => {
  const { ctx, calls, store } = harness({ secondSchool: true })
  const results = await runMigration({ command: 'migrate', years: null }, ctx)
  assert.equal(calls.uploads, 1)
  assert.equal(calls.downloads, 2)
  assert.equal(results.schools.every((school) => school.updateStatus === 'updated'), true)
  const report = store.report()
  assert.equal(report.filesMigrated, 1)
  assert.equal(report.duplicatesReused, 1)
  store.close()
})

test('resumes from an uploaded asset without downloading it again', async () => {
  const { ctx, calls, documents, store } = harness()
  ctx.wordpress.download = async () => {
    throw new Error('download should not run')
  }
  ctx.hygraph.uploadFile = async () => {
    throw new Error('upload should not run')
  }
  store.upsertLink({
    schoolId: 's1',
    schoolName: 'COESSING 2024',
    schoolYear: 2024,
    fieldName: 'schoolDetails',
    originalUrl: WP_URL,
    filename: 'coessing24_schedule.pdf',
    fileHash: 'abc123',
    hygraphAssetId: 'asset-1',
    hygraphUrl: ASSET_URL,
    status: 'UPLOADED',
    reused: 0,
  })
  const results = await runMigration({ command: 'resume', id: 's1', years: [2024] }, ctx)
  assert.equal(calls.downloads, 0)
  assert.equal(calls.uploads, 0)
  assert.equal(results.schools[0].updateStatus, 'updated')
  assert.equal(documents.get('s1').children[1].children[1].href, ASSET_URL)
  store.close()
})

test('skips a file larger than the Hygraph upload limit without downloading it', async () => {
  const { ctx, calls, documents, store } = harness({
    media: { media_details: { filesize: 50 * 1024 * 1024 + 1 } },
  })
  const results = await runMigration({ command: 'migrate', id: 's1', years: [2024] }, ctx)
  assert.equal(calls.downloads, 0)
  assert.equal(calls.uploads, 0)
  assert.equal(calls.updates, 0)
  assert.equal(results.schools[0].updateStatus, 'incomplete')
  assert.equal(store.getLink('s1', 'schoolDetails', WP_URL).status, 'SKIPPED')
  assert.equal(store.getLink('s1', 'schoolDetails', WP_URL).failure_stage, 'size')
  assert.equal(findWordPressLinks(documents.get('s1')).length, 1)
  store.close()
})

test('skips a file that cannot be matched and leaves the school unchanged', async () => {
  const { ctx, calls, documents, store } = harness({ failFind: true })
  const results = await runMigration({ command: 'migrate', id: 's1', years: [2024] }, ctx)
  assert.equal(calls.uploads, 0)
  assert.equal(calls.updates, 0)
  assert.equal(results.schools[0].updateStatus, 'incomplete')
  assert.equal(store.getLink('s1', 'schoolDetails', WP_URL).status, 'SKIPPED')
  assert.equal(findWordPressLinks(documents.get('s1')).length, 1)
  store.close()
})

test('reconciles a draft that already points at the uploaded asset', async () => {
  const { ctx, calls, documents, store } = harness()
  const migrated = richText()
  migrated.children[1].children[1].href = ASSET_URL
  documents.set('s1', migrated)
  store.upsertLink({
    schoolId: 's1',
    schoolName: 'COESSING 2024',
    schoolYear: 2024,
    fieldName: 'schoolDetails',
    originalUrl: WP_URL,
    filename: 'coessing24_schedule.pdf',
    fileHash: 'abc123',
    hygraphAssetId: 'asset-1',
    hygraphUrl: ASSET_URL,
    status: 'FAILED',
    failureStage: 'update',
    errorMessage: 'stale read',
    reused: 0,
  })
  const results = await runMigration({ command: 'resume', id: 's1', years: [2024] }, ctx)
  assert.equal(calls.uploads, 0)
  assert.equal(calls.updates, 0)
  assert.equal(results.schools[0].updateStatus, 'updated')
  assert.equal(store.getLink('s1', 'schoolDetails', WP_URL).status, 'VERIFIED')
  store.close()
})
test('records a download failure and does not update content', async () => {
  const { ctx, calls, store } = harness({ failDownload: true })
  const results = await runMigration({ command: 'migrate', id: 's1', years: [2024] }, ctx)
  assert.equal(calls.updates, 0)
  assert.equal(results.schools[0].updateStatus, 'incomplete')
  const row = store.getLink('s1', 'schoolDetails', WP_URL)
  assert.equal(row.status, 'FAILED')
  assert.equal(row.failure_stage, 'download')
  assert.equal(store.report().failedDownloads, 1)
  store.close()
})
