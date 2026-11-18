const test = require('node:test')
const assert = require('node:assert/strict')
const {
  diffContent,
  findWordPressLinks,
  replaceLinkHrefs,
} = require('../../scripts/migration/richtext')

function document() {
  return {
    children: [
      {
        type: 'paragraph',
        children: [
          { text: 'Read ' },
          {
            type: 'link',
            href: 'https://coessing.org/wp-content/uploads/2023/07/updated-online-schedule-.pdf',
            title: 'Schedule',
            openInNewTab: false,
            children: [{ text: 'Our Online Schedule Link', bold: true }],
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://science.jpl.nasa.gov/people/babette-tchonang/',
            openInNewTab: false,
            children: [{ text: 'profile' }],
          },
        ],
      },
      {
        type: 'image',
        src: 'https://ap-south-1.graphassets.com/existing',
        title: 'Photo',
        width: 640,
        height: 480,
        handle: 'abc',
        mimeType: 'image/png',
        children: [{ text: '' }],
      },
      {
        type: 'bulleted-list',
        children: [{ type: 'list-item', children: [{ type: 'list-item-child', children: [{ text: 'Keep me' }] }] }],
      },
    ],
  }
}

test('finds only WordPress media hyperlinks', () => {
  const links = findWordPressLinks(document())
  assert.equal(links.length, 1)
  assert.equal(links[0].text, 'Our Online Schedule Link')
  assert.equal(links[0].href.endsWith('/updated-online-schedule-.pdf'), true)
})

test('replaces a WordPress URL without changing the surrounding document', () => {
  const original = document()
  const snapshot = structuredClone(original)
  const nextUrl = 'https://ap-south-1.graphassets.com/new-schedule'
  const replacements = new Map([[original.children[0].children[1].href, nextUrl]])
  const { raw, changed } = replaceLinkHrefs(original, replacements)

  assert.deepEqual(original, snapshot)
  assert.equal(changed.length, 1)
  assert.equal(raw.children[0].children[1].href, nextUrl)
  assert.equal(raw.children[0].children[1].children[0].text, 'Our Online Schedule Link')
  assert.equal(raw.children[0].children[1].children[0].bold, true)
  assert.equal(raw.children[1].children[0].href, 'https://science.jpl.nasa.gov/people/babette-tchonang/')
  assert.equal(raw.children[2].src, 'https://ap-south-1.graphassets.com/existing')
  assert.deepEqual(diffContent(original, raw, replacements), [])
})
