const fs = require('fs')
const path = require('path')
const { DatabaseSync } = require('node:sqlite')

const SCHEMA = `
CREATE TABLE IF NOT EXISTS assets (
  file_hash TEXT PRIMARY KEY,
  original_url TEXT,
  wp_media_id TEXT,
  filename TEXT,
  mime_type TEXT,
  byte_size INTEGER,
  hygraph_asset_id TEXT,
  hygraph_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id TEXT NOT NULL,
  school_name TEXT,
  school_year INTEGER,
  field_name TEXT NOT NULL,
  original_url TEXT NOT NULL,
  link_text TEXT,
  filename TEXT,
  file_hash TEXT,
  wp_media_id TEXT,
  hygraph_asset_id TEXT,
  hygraph_url TEXT,
  status TEXT NOT NULL,
  reused INTEGER NOT NULL DEFAULT 0,
  failure_stage TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (school_id, field_name, original_url)
);

CREATE TABLE IF NOT EXISTS schools (
  school_id TEXT PRIMARY KEY,
  school_name TEXT,
  school_year INTEGER,
  slug TEXT,
  scanned_at TEXT,
  updated_at TEXT,
  update_status TEXT,
  remaining_wp_urls INTEGER,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  command TEXT NOT NULL,
  dry_run INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  schools_scanned INTEGER DEFAULT 0,
  schools_updated INTEGER DEFAULT 0
);
`

function now() {
  return new Date().toISOString()
}

function openStore(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec(SCHEMA)

  const statements = {
    upsertLink: db.prepare(`
      INSERT INTO links (
        school_id, school_name, school_year, field_name, original_url, link_text, filename,
        file_hash, wp_media_id, hygraph_asset_id, hygraph_url, status, reused, failure_stage,
        error_message, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (school_id, field_name, original_url) DO UPDATE SET
        school_name = excluded.school_name,
        school_year = excluded.school_year,
        link_text = excluded.link_text,
        filename = COALESCE(excluded.filename, links.filename),
        file_hash = COALESCE(excluded.file_hash, links.file_hash),
        wp_media_id = COALESCE(excluded.wp_media_id, links.wp_media_id),
        hygraph_asset_id = COALESCE(excluded.hygraph_asset_id, links.hygraph_asset_id),
        hygraph_url = COALESCE(excluded.hygraph_url, links.hygraph_url),
        status = excluded.status,
        reused = excluded.reused,
        failure_stage = excluded.failure_stage,
        error_message = excluded.error_message,
        updated_at = excluded.updated_at
    `),
    getLink: db.prepare(`
      SELECT * FROM links WHERE school_id = ? AND field_name = ? AND original_url = ?
    `),
    listLinks: db.prepare(`SELECT * FROM links ORDER BY school_year DESC, school_name, id`),
    findAssetByHash: db.prepare(`SELECT * FROM assets WHERE file_hash = ?`),
    findAssetByUrl: db.prepare(`
      SELECT * FROM assets WHERE original_url = ? AND hygraph_url IS NOT NULL
      UNION
      SELECT * FROM assets WHERE hygraph_url IS NOT NULL AND file_hash IN (
        SELECT file_hash FROM links WHERE original_url = ? AND file_hash IS NOT NULL
      )
      LIMIT 1
    `),
    findReusableByUrl: db.prepare(`
      SELECT hygraph_asset_id, hygraph_url, file_hash, filename, wp_media_id
      FROM links
      WHERE original_url = ? AND hygraph_url IS NOT NULL
      ORDER BY updated_at DESC
      LIMIT 1
    `),
    upsertAsset: db.prepare(`
      INSERT INTO assets (
        file_hash, original_url, wp_media_id, filename, mime_type, byte_size,
        hygraph_asset_id, hygraph_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (file_hash) DO UPDATE SET
        original_url = excluded.original_url,
        wp_media_id = COALESCE(excluded.wp_media_id, assets.wp_media_id),
        filename = excluded.filename,
        mime_type = excluded.mime_type,
        byte_size = excluded.byte_size,
        hygraph_asset_id = COALESCE(excluded.hygraph_asset_id, assets.hygraph_asset_id),
        hygraph_url = COALESCE(excluded.hygraph_url, assets.hygraph_url),
        updated_at = excluded.updated_at
    `),
    upsertSchool: db.prepare(`
      INSERT INTO schools (
        school_id, school_name, school_year, slug, scanned_at, updated_at, update_status, remaining_wp_urls, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (school_id) DO UPDATE SET
        school_name = excluded.school_name,
        school_year = excluded.school_year,
        slug = excluded.slug,
        scanned_at = excluded.scanned_at,
        updated_at = excluded.updated_at,
        update_status = excluded.update_status,
        remaining_wp_urls = excluded.remaining_wp_urls,
        error_message = excluded.error_message
    `),
    insertBackup: db.prepare(`
      INSERT INTO backups (school_id, field_name, raw_json, created_at) VALUES (?, ?, ?, ?)
    `),
    insertRun: db.prepare(`
      INSERT INTO runs (command, dry_run, started_at) VALUES (?, ?, ?)
    `),
    finishRun: db.prepare(`
      UPDATE runs SET finished_at = ?, schools_scanned = ?, schools_updated = ? WHERE id = ?
    `),
    countByStatus: db.prepare(`SELECT status, COUNT(*) AS count FROM links GROUP BY status`),
    countReused: db.prepare(`
      SELECT COUNT(*) AS count FROM links WHERE reused = 1 AND status IN ('UPLOADED', 'REPLACED', 'VERIFIED')
    `),
    countMigrated: db.prepare(`
      SELECT COUNT(DISTINCT file_hash) AS count FROM links
      WHERE reused = 0 AND hygraph_url IS NOT NULL AND status IN ('UPLOADED', 'REPLACED', 'VERIFIED')
    `),
    countFailures: db.prepare(`
      SELECT failure_stage, COUNT(*) AS count FROM links WHERE status = 'FAILED' GROUP BY failure_stage
    `),
    countSkipped: db.prepare(`SELECT COUNT(*) AS count FROM links WHERE status = 'SKIPPED'`),
    countSchools: db.prepare(`SELECT COUNT(*) AS count FROM schools`),
    countUpdatedSchools: db.prepare(`
      SELECT COUNT(*) AS count FROM schools
      WHERE update_status IN ('updated', 'published', 'published-partial')
    `),
    remainingLinks: db.prepare(`
      SELECT COUNT(*) AS count FROM links
      WHERE status NOT IN ('VERIFIED', 'REPLACED', 'SKIPPED')
    `),
  }

  return {
    db,
    upsertLink(row) {
      const timestamp = now()
      statements.upsertLink.run(
        row.schoolId,
        row.schoolName || null,
        row.schoolYear ?? null,
        row.fieldName,
        row.originalUrl,
        row.linkText || null,
        row.filename || null,
        row.fileHash || null,
        row.wpMediaId != null ? String(row.wpMediaId) : null,
        row.hygraphAssetId || null,
        row.hygraphUrl || null,
        row.status,
        row.reused ? 1 : 0,
        row.failureStage || null,
        row.errorMessage || null,
        timestamp,
        timestamp
      )
    },
    getLink(schoolId, fieldName, originalUrl) {
      return statements.getLink.get(schoolId, fieldName, originalUrl) || null
    },
    listLinks() {
      return statements.listLinks.all()
    },
    findReusableAsset({ fileHash, originalUrl }) {
      if (fileHash) {
        const byHash = statements.findAssetByHash.get(fileHash)
        if (byHash?.hygraph_url) return byHash
      }
      if (originalUrl) {
        const byAssetUrl = statements.findAssetByUrl.get(originalUrl, originalUrl)
        if (byAssetUrl?.hygraph_url) return byAssetUrl
        const byLink = statements.findReusableByUrl.get(originalUrl)
        if (byLink?.hygraph_url) return byLink
      }
      return null
    },
    saveAsset(row) {
      const timestamp = now()
      statements.upsertAsset.run(
        row.fileHash,
        row.originalUrl || null,
        row.wpMediaId != null ? String(row.wpMediaId) : null,
        row.filename || null,
        row.mimeType || null,
        row.byteSize ?? null,
        row.hygraphAssetId || null,
        row.hygraphUrl || null,
        timestamp,
        timestamp
      )
    },
    upsertSchool(row) {
      const timestamp = now()
      statements.upsertSchool.run(
        row.schoolId,
        row.schoolName || null,
        row.schoolYear ?? null,
        row.slug || null,
        row.scannedAt || timestamp,
        timestamp,
        row.updateStatus || null,
        row.remainingWpUrls ?? null,
        row.errorMessage || null
      )
    },
    backup(schoolId, fieldName, raw) {
      statements.insertBackup.run(schoolId, fieldName, JSON.stringify(raw), now())
    },
    startRun(command, dryRun) {
      const result = statements.insertRun.run(command, dryRun ? 1 : 0, now())
      return Number(result.lastInsertRowid)
    },
    finishRun(id, summary) {
      statements.finishRun.run(now(), summary.schoolsScanned || 0, summary.schoolsUpdated || 0, id)
    },
    report() {
      const statusCounts = Object.fromEntries(statements.countByStatus.all().map((row) => [row.status, row.count]))
      const failures = Object.fromEntries(
        statements.countFailures.all().map((row) => [row.failure_stage || 'unknown', row.count])
      )
      return {
        schoolsScanned: statements.countSchools.get().count,
        schoolsUpdated: statements.countUpdatedSchools.get().count,
        filesDiscovered: statements.listLinks.all().length,
        filesMigrated: statements.countMigrated.get().count,
        duplicatesReused: statements.countReused.get().count,
        failedDownloads: failures.download || 0,
        failedUploads: failures.upload || 0,
        failedContentUpdates: failures.update || 0,
        skipped: statements.countSkipped.get().count,
        remainingWordPressUrls: statements.remainingLinks.get().count,
        statusCounts,
      }
    },
    close() {
      db.close()
    },
  }
}

module.exports = {
  openStore,
}
