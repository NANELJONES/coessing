const fs = require('fs')
const path = require('path')
const { GraphQLClient, gql } = require('graphql-request')

const envPath = path.join(__dirname, '..', '.env')
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(l => l && !l.startsWith('#') && l.includes('=')).map(l => {
    const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)
const client = new GraphQLClient(env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT, {
  headers: { authorization: `Bearer ${env.NEXT_PUBLIC_API_TOKEN}` },
})

const q = gql`query { t: __type(name: "SchoolType") { enumValues { name } } }`

client.request(q).then(d => {
  console.log(JSON.stringify(d.t.enumValues))
}).catch(e => console.error(e.message))
