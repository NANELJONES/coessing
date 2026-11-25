import { GraphQLClient, gql } from 'graphql-request'
import { readFileSync, existsSync } from 'fs'

function loadEnv(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (!process.env[m[1]]) process.env[m[1]] = v
  }
}

loadEnv('.env.local')
loadEnv('.env')

const endpoint = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT || process.env.HYGRAPH_ENDPOINT
const token = process.env.NEXT_PUBLIC_API_TOKEN || process.env.HYGRAPH_TOKEN
const client = new GraphQLClient(endpoint, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
})

const data = await client.request(gql`
  query {
    testimonialsConnection(first: 100, where: { schoolType: coessing }) {
      edges {
        node {
          id
          schoolYear
          school { schoolYear }
          image { mimeType }
        }
      }
      pageInfo { hasNextPage }
      aggregate { count }
    }
  }
`)

const nodes = data.testimonialsConnection.edges.map((e) => e.node)
const years = {}
const mimes = {}
for (const n of nodes) {
  const y = n.school?.schoolYear || n.schoolYear || 'unknown'
  years[y] = (years[y] || 0) + 1
  const m = n.image?.mimeType || 'none'
  mimes[m] = (mimes[m] || 0) + 1
}
console.log({ count: data.testimonialsConnection.aggregate.count, hasNext: data.testimonialsConnection.pageInfo.hasNextPage, years, mimes })
