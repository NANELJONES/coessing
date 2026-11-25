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
if (!endpoint) {
  console.error('No endpoint')
  process.exit(1)
}

const client = new GraphQLClient(endpoint, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
})

const query = gql`
  query {
    __type(name: "Testimonial") {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
            ofType { name kind }
          }
        }
      }
    }
  }
`

const data = await client.request(query)
console.log(JSON.stringify(data, null, 2))
