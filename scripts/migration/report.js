function formatReport(report) {
  return [
    `Schools scanned: ${report.schoolsScanned}`,
    `Schools updated: ${report.schoolsUpdated}`,
    `Files discovered: ${report.filesDiscovered}`,
    `Files migrated: ${report.filesMigrated}`,
    `Duplicate files reused: ${report.duplicatesReused}`,
    `Failed downloads: ${report.failedDownloads}`,
    `Failed uploads: ${report.failedUploads}`,
    `Failed content updates: ${report.failedContentUpdates}`,
    `Skipped files: ${report.skipped}`,
    `Remaining WordPress URLs: ${report.remainingWordPressUrls}`,
  ].join('\n')
}

function formatSchoolResult(result) {
  const lines = [`${result.year || '-'} ${result.name} [${result.updateStatus}]`]
  if (result.slug) lines[0] += ` ${result.slug}`
  for (const link of result.links || []) {
    const target = link.hygraphUrl || link.status
    lines.push(`  ${link.fieldName}: ${link.href}`)
    lines.push(`    -> ${target}${link.reused ? ' (reused)' : ''}${link.error ? ` (${link.error})` : ''}`)
  }
  for (const note of result.notes || []) lines.push(`  note: ${note}`)
  if (result.updateError) lines.push(`  update error: ${result.updateError}`)
  return lines.join('\n')
}

module.exports = {
  formatReport,
  formatSchoolResult,
}
