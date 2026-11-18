const { isWordPressMediaUrl } = require('./urls')

function walkRichText(node, visit) {
  if (!node || typeof node !== 'object') return
  visit(node)
  if (Array.isArray(node.children)) {
    for (const child of node.children) walkRichText(child, visit)
  }
}

function linkText(node) {
  const parts = []
  walkRichText(node, (current) => {
    if (current !== node && typeof current.text === 'string') parts.push(current.text)
  })
  return parts.join('')
}

function findWordPressLinks(raw) {
  const links = []
  walkRichText(raw, (node) => {
    if (node.type !== 'link' || typeof node.href !== 'string') return
    if (!isWordPressMediaUrl(node.href)) return
    links.push({
      href: node.href,
      text: linkText(node),
      title: node.title || null,
      openInNewTab: Boolean(node.openInNewTab),
    })
  })
  return links
}

function findPlainTextWordPressUrls(raw) {
  const urls = []
  walkRichText(raw, (node) => {
    if (typeof node.text !== 'string') return
    const matches = node.text.match(/https?:\/\/[^\s<>"')]+/g) || []
    for (const match of matches) {
      const cleaned = match.replace(/[.,]+$/, '')
      if (isWordPressMediaUrl(cleaned)) urls.push(cleaned)
    }
  })
  return urls
}

function replaceLinkHrefs(raw, replacements) {
  const next = structuredClone(raw)
  const changed = []
  walkRichText(next, (node) => {
    if (node.type !== 'link' || typeof node.href !== 'string') return
    if (!replacements.has(node.href)) return
    const from = node.href
    node.href = replacements.get(from)
    changed.push({ from, to: node.href })
  })
  return { raw: next, changed }
}

function compactRichText(node) {
  if (Array.isArray(node)) return node.map(compactRichText)
  if (!node || typeof node !== 'object') return node
  const next = {}
  for (const [key, value] of Object.entries(node)) {
    if (key === 'handle' || key === 'mimeType' || key === 'className') continue
    if (key === 'openInNewTab' && value === false) continue
    next[key] = key === 'children' ? compactRichText(value) : value
  }
  return next
}

function contentSignature(raw) {
  const items = []
  walkRichText(raw, (node) => {
    if (typeof node.text === 'string') {
      items.push([
        'text',
        node.text,
        Boolean(node.bold),
        Boolean(node.italic),
        Boolean(node.underline),
        Boolean(node.code),
      ])
      return
    }
    if (!node.type) return
    items.push([
      node.type,
      node.href || '',
      node.src || '',
      node.url || '',
      node.title || '',
      Boolean(node.openInNewTab),
      node.altText || '',
      node.width == null ? '' : String(node.width),
      node.height == null ? '' : String(node.height),
    ])
  })
  return items
}

function diffContent(before, after, replacements) {
  const left = contentSignature(before)
  const right = contentSignature(after)
  const errors = []
  if (left.length !== right.length) errors.push(`node count ${left.length} -> ${right.length}`)
  const count = Math.min(left.length, right.length)
  for (let index = 0; index < count; index += 1) {
    const source = left[index]
    const saved = right[index]
    if (source[0] === 'link' && replacements.has(source[1])) {
      if (saved[0] !== 'link' || saved[1] !== replacements.get(source[1])) {
        errors.push(`link ${index} was not replaced`)
      }
      if (source.slice(2).join('|') !== saved.slice(2).join('|')) {
        errors.push(`link ${index} attributes changed`)
      }
      continue
    }
    if (source.join('|') !== saved.join('|')) errors.push(`node ${index} changed`)
  }
  return errors
}

function diffRichText(before, after, replacements) {
  const errors = []
  function compare(left, right, path) {
    if (Array.isArray(left)) {
      if (!Array.isArray(right) || left.length !== right.length) {
        errors.push(`${path} changed length`)
        return
      }
      left.forEach((item, index) => compare(item, right[index], `${path}[${index}]`))
      return
    }
    if (left && typeof left === 'object') {
      if (!right || typeof right !== 'object' || Array.isArray(right)) {
        errors.push(`${path} changed type`)
        return
      }
      for (const key of Object.keys(left)) {
        if (key === 'href' && left.type === 'link' && replacements.has(left.href)) {
          if (right.href !== replacements.get(left.href)) {
            errors.push(`${path}.href was not replaced with the Hygraph URL`)
          }
          continue
        }
        compare(left[key], right[key], `${path}.${key}`)
      }
      return
    }
    if (left !== right) errors.push(`${path} changed`)
  }
  compare(before, after, 'root')
  return errors
}

module.exports = {
  walkRichText,
  findWordPressLinks,
  findPlainTextWordPressUrls,
  replaceLinkHrefs,
  compactRichText,
  diffRichText,
  diffContent,
}
