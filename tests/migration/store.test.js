const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { openStore } = require('../../scripts/migration/store')

function temporaryStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'coessing-store-'))
  return openStore(path.join(dir, 'migration.sqlite'))
}

test('stores an upload and resumes it without treating the same row as a duplicate', () => {
  const store = temporaryStore()
  store.upsertLink({
    schoolId: 'school-1',
    schoolName: 'COESSING 2024',
    schoolYear: 2024,
    fieldName: 'schoolDetails',
    originalUrl: 'https://coessing.org/wp-content/uploads/2024/09/coessing24_schedule.pdf',
    filename: 'coessing24_schedule.pdf',
    fileHash: 'hash-1',
    wpMediaId: 2872,
    hygraphAssetId: 'asset-1',
    hygraphUrl: 'https://ap-south-1.graphassets.com/asset-1',
    status: 'UPLOADED',
    reused: 0,
  })
  store.saveAsset({
    fileHash: 'hash-1',
    originalUrl: 'https://coessing.org/wp-content/uploads/2024/09/coessing24_schedule.pdf',
    wpMediaId: 2872,
    filename: 'coessing24_schedule.pdf',
    mimeType: 'application/pdf',
    byteSize: 10,
    hygraphAssetId: 'asset-1',
    hygraphUrl: 'https://ap-south-1.graphassets.com/asset-1',
  })

  const again = store.getLink('school-1', 'schoolDetails', 'https://coessing.org/wp-content/uploads/2024/09/coessing24_schedule.pdf')
  assert.equal(again.status, 'UPLOADED')
  assert.equal(again.hygraph_url, 'https://ap-south-1.graphassets.com/asset-1')

  const reusable = store.findReusableAsset({
    fileHash: 'hash-1',
    originalUrl: 'https://coessing.org/wp-content/uploads/2023/07/other.pdf',
  })
  assert.equal(reusable.hygraph_asset_id, 'asset-1')

  store.upsertLink({
    schoolId: 'school-2',
    schoolName: 'COESSING 2023',
    schoolYear: 2023,
    fieldName: 'schoolDetails',
    originalUrl: 'https://coessing.org/wp-content/uploads/2023/07/other.pdf',
    fileHash: 'hash-1',
    hygraphAssetId: 'asset-1',
    hygraphUrl: 'https://ap-south-1.graphassets.com/asset-1',
    status: 'VERIFIED',
    reused: 1,
  })
  const report = store.report()
  assert.equal(report.filesMigrated, 1)
  assert.equal(report.duplicatesReused, 1)
  store.close()
})

test('keeps a rich text backup and records a failed download', () => {
  const store = temporaryStore()
  store.backup('school-1', 'schoolDetails', { children: [{ text: 'original' }] })
  store.upsertLink({
    schoolId: 'school-1',
    schoolName: 'COESSING 2024',
    schoolYear: 2024,
    fieldName: 'schoolDetails',
    originalUrl: 'https://coessing.org/wp-content/uploads/2024/09/missing.pdf',
    status: 'FAILED',
    failureStage: 'download',
    errorMessage: 'WordPress media record was not found',
  })
  const report = store.report()
  assert.equal(report.failedDownloads, 1)
  assert.equal(report.filesMigrated, 0)
  store.close()
})
