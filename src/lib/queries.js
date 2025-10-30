import { gql } from 'graphql-request'

export const GET_SCHOOLS = gql`
  query GetSchools($first: Int!) {
    schoolsConnection(first: $first) {
      edges {
        node {
          country
          coverImage {
            url
          }
          excerpt
          id
          schoolName
          schoolLocation
          schoolDetails {
            raw
          }
          schoolStatus
          schoolTheme
          schoolYear
          slug
          instructors
        }
      }
    }
  }
`

export const GET_SCHOOL_BY_SLUG = gql`
  query GetSchoolBySlug($slug: String!) {
    school(where: { slug: $slug }) {
      country
      coverImage {
        url
      }
      excerpt
      id
      schoolName
      schoolLocation
      schoolDetails {
        raw
      }
      schoolStatus
      schoolTheme
      schoolYear
      slug
      instructors
    }
  }
`

export const GET_GALLERIES_BY_SCHOOL = gql`
  query GetGalleriesBySchool($slug: String!, $first: Int!, $skip: Int!) {
    galleriesConnection(
      where: { school: { slug: $slug } }
      first: $first
      skip: $skip
      orderBy: createdAt_DESC
    ) {
      edges {
        node {
          id
          title
          galleryAsset {
            url
            id
          }
          school {
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

export const GET_PARTNERS = gql`
  query GetPartners {
    partnersConnection {
      edges {
        node {
          partnerName
          partnerLogo {
            url
          }
        }
      }
    }
  }
`

export const GET_COMMUNITY_VOICES = gql`
  query GetCommunityVoices($first: Int!, $skip: Int!) {
    communityVoicesConnection(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      edges {
        node {
          id
          voice { url }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

export const GET_TESTIMONIALS = gql`
  query GetTestimonials($first: Int!, $skip: Int!) {
    testimonialsConnection(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      edges {
        node {
          id
          title
          interest
          schoolYear
          testimonial
          image { url }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`