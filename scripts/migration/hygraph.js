const fs = require('fs')
const { gql, GraphQLClient } = require('graphql-request')
const { HttpError, withRetry } = require('./retry')

const CREATE_ASSET = gql`
  mutation CreateMigrationAsset($fileName: String!) {
    createAsset(data: { fileName: $fileName }) {
      id
      url
      fileName
      mimeType
      size
      upload {
        status
        expiresAt
        error {
          code
          message
        }
        requestPostData {
          url
          date
          key
          signature
          algorithm
          policy
          credential
          securityToken
        }
      }
    }
  }
`

const ASSET_QUERY = gql`
  query MigrationAsset($id: ID!, $stage: Stage!) {
    asset(where: { id: $id }, stage: $stage) {
      id
      url
      fileName
      mimeType
      size
      upload {
        status
        error {
          code
          message
        }
      }
    }
  }
`

const PUBLISH_ASSET = gql`
  mutation PublishMigrationAsset($id: ID!) {
    publishAsset(where: { id: $id }, to: [PUBLISHED]) {
      id
      url
    }
  }
`

function assertFieldName(name) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error(`Refusing to query unexpected field name: ${name}`)
  }
}

function graphqlMessage(error) {
  const messages = error?.response?.errors?.map((item) => item.message).filter(Boolean)
  if (messages?.length) return messages.join('; ')
  return error?.message || 'Hygraph request failed'
}

function createHygraph(config, options = {}) {
  const fetchImpl = options.fetch || fetch
  const client =
    options.client ||
    new GraphQLClient(config.endpoint, {
      headers: { authorization: `Bearer ${config.token}` },
      fetch: fetchImpl,
    })
  const retries = options.retries ?? config.retries
  const delayMs = options.delayMs ?? config.delayMs

  async function request(document, variables) {
    return withRetry(
      async () => {
        if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs))
        try {
          return await client.request(document, variables)
        } catch (error) {
          const message = graphqlMessage(error)
          const status = error?.response?.status
          const wrapped = new HttpError(message, status, {
            retryable: !status || status >= 500 || status === 429,
          })
          throw wrapped
        }
      },
      { retries, baseDelayMs: 700 }
    )
  }

  async function richTextFields() {
    const data = await request(`
      query MigrationRichTextFields {
        school: __type(name: "School") {
          fields {
            name
            type {
              name
              kind
              ofType { name kind ofType { name kind } }
            }
          }
        }
      }
    `)
    const fields = []
    for (const field of data.school?.fields || []) {
      const names = [field.type?.name, field.type?.ofType?.name, field.type?.ofType?.ofType?.name]
      if (names.includes('RichText')) {
        assertFieldName(field.name)
        fields.push(field.name)
      }
    }
    if (!fields.length) throw new Error('School model has no RichText fields')
    return fields
  }

  async function listSchools() {
    const schools = []
    const pageSize = 50
    let skip = 0
    while (true) {
      const data = await request(
        `
          query MigrationSchools($first: Int!, $skip: Int!) {
            schoolsConnection(first: $first, skip: $skip, orderBy: schoolYear_DESC) {
              edges {
                node { id schoolName schoolYear slug schoolType }
              }
              pageInfo { hasNextPage }
            }
          }
        `,
        { first: pageSize, skip }
      )
      const edges = data.schoolsConnection?.edges || []
      schools.push(...edges.map((edge) => edge.node))
      if (!data.schoolsConnection?.pageInfo?.hasNextPage || edges.length === 0) break
      skip += edges.length
    }
    return schools
  }

  async function getSchool(id, fields, stage = 'DRAFT') {
    for (const field of fields) assertFieldName(field)
    if (stage !== 'DRAFT' && stage !== 'PUBLISHED') throw new Error('Unsupported content stage')
    const selection = fields.map((field) => `${field} { raw }`).join('\n')
    const data = await request(
      `
        query MigrationSchool($id: ID!, $stage: Stage!) {
          school(where: { id: $id }, stage: $stage) {
            id
            schoolName
            schoolYear
            slug
            schoolType
            ${selection}
          }
        }
      `,
      { id, stage }
    )
    return data.school
  }

  async function updateSchoolRichText(id, updates) {
    const names = Object.keys(updates)
    for (const name of names) assertFieldName(name)
    const definitions = ['$id: ID!', ...names.map((name) => `$${name}: RichTextAST`)]
    const assignments = names.map((name) => `${name}: $${name}`).join('\n')
    const selection = names.map((name) => `${name} { raw }`).join('\n')
    const variables = { id, ...updates }
    const data = await request(
      `
        mutation MigrationUpdateSchool(${definitions.join(', ')}) {
          updateSchool(where: { id: $id }, data: { ${assignments} }) {
            id
            ${selection}
          }
        }
      `,
      variables
    )
    return data.updateSchool
  }

  async function publishSchool(id) {
    if (!config.publishSchools) {
      throw new Error('School publishing is disabled')
    }
    const data = await request(
      `
        mutation MigrationPublishSchool($id: ID!) {
          publishSchool(where: { id: $id }, to: [PUBLISHED]) { id }
        }
      `,
      { id }
    )
    return data.publishSchool
  }

  async function createAsset(fileName) {
    const data = await request(CREATE_ASSET, { fileName })
    return data.createAsset
  }

  async function getAsset(id) {
    const data = await request(ASSET_QUERY, { id, stage: 'DRAFT' })
    return data.asset
  }

  async function uploadBinary(created, filePath, fileName, mimeType) {
    const post = created?.upload?.requestPostData
    if (!post?.url || !post.key || !post.policy || !post.signature) {
      throw new Error('Hygraph did not return upload instructions')
    }
    const send = async (includeContentType) => {
      const form = new FormData()
      form.append('key', post.key)
      form.append('X-Amz-Algorithm', post.algorithm)
      form.append('X-Amz-Credential', post.credential)
      form.append('X-Amz-Date', post.date)
      form.append('policy', post.policy)
      form.append('X-Amz-Signature', post.signature)
      if (post.securityToken) form.append('X-Amz-Security-Token', post.securityToken)
      if (includeContentType && mimeType) form.append('Content-Type', mimeType)
      const blob = await fs.openAsBlob(filePath, mimeType ? { type: mimeType } : undefined)
      form.append('file', blob, fileName)
      const response = await fetchImpl(post.url, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(600000),
      })
      if (!response.ok && response.status !== 204) {
        const detail = (await response.text()).slice(0, 300)
        throw new HttpError(`Asset binary upload failed with HTTP ${response.status}: ${detail}`, response.status, {
          retryable: response.status >= 500 || response.status === 429,
        })
      }
    }
    await send(false)
  }

  async function waitForAsset(id) {
    let last = null
    for (let attempt = 0; attempt < 20; attempt += 1) {
      last = await getAsset(id)
      const status = last?.upload?.status
      if (status === 'ASSET_UPLOAD_COMPLETE' && last.url) return last
      if (status === 'ASSET_ERROR_UPLOAD') {
        const message = last?.upload?.error?.message || 'Hygraph asset upload failed'
        throw new Error(message)
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    throw new Error(`Hygraph asset ${id} did not become available (${last?.upload?.status || 'missing'})`)
  }

  async function verifyPublicUrl(url) {
    const response = await fetchImpl(url, {
      headers: { range: 'bytes=0-32' },
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
    })
    if (response.status !== 200 && response.status !== 206) {
      throw new HttpError(`Hygraph asset URL returned HTTP ${response.status}`, response.status, { retryable: false })
    }
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length < 4) throw new Error('Hygraph asset URL returned an empty file')
    return true
  }

  async function finalizeAsset(id) {
    let ready = await waitForAsset(id)
    try {
      await verifyPublicUrl(ready.url)
    } catch (error) {
      if (!config.publishAssets) throw error
      await request(PUBLISH_ASSET, { id })
      ready = await getAsset(id)
      await verifyPublicUrl(ready.url)
    }
    return {
      id: ready.id,
      url: ready.url,
      fileName: ready.fileName,
      mimeType: ready.mimeType,
      size: ready.size,
    }
  }

  async function uploadFile({ filePath, fileName, mimeType }) {
    const created = await createAsset(fileName)
    if (!created?.id) throw new Error('Hygraph did not create an asset record')
    try {
      await uploadBinary(created, filePath, fileName, mimeType)
      return await finalizeAsset(created.id)
    } catch (error) {
      error.assetId = created.id
      throw error
    }
  }

  return {
    richTextFields,
    listSchools,
    getSchool,
    updateSchoolRichText,
    publishSchool,
    uploadFile,
    getAsset,
    verifyPublicUrl,
    finalizeAsset,
  }
}

module.exports = {
  createHygraph,
  graphqlMessage,
}
