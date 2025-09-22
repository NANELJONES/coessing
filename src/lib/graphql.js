import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT
const token = process.env.NEXT_PUBLIC_API_TOKEN

export const graphcms = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`,
  },
})
