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

const q = gql`query {
  school: __type(name: "School") {
    fields { name type { name kind ofType { name kind ofType { name } } } }
  }
  funder: __type(name: "Funder") {
    fields { name type { name kind ofType { name kind ofType { name } } } }
  }
  schoolPartner: __type(name: "SchoolPartner") {
    fields { name type { name kind ofType { name kind ofType { name } } } }
  }
}`

client.request(q).then(d => {
  console.log('=== School fields ===')
  d.school.fields.forEach(f => console.log(f.name, JSON.stringify(f.type)))
  console.log('\n=== Funder fields ===')
  ;(d.funder?.fields || []).forEach(f => console.log(f.name, JSON.stringify(f.type)))
  console.log('\n=== SchoolPartner fields ===')
  ;(d.schoolPartner?.fields || []).forEach(f => console.log(f.name, JSON.stringify(f.type)))
}).catch(e => console.error(e.message || e))
