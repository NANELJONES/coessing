import { graphcms } from './graphql'
import { GET_SCHOOLS, GET_SCHOOL_BY_SLUG, GET_GALLERIES_BY_SCHOOL, GET_PARTNERS } from './queries'

export async function getSchools(limit = 7) {
  try {
    const data = await graphcms.request(GET_SCHOOLS, { first: limit })
    return data.schoolsConnection.edges.map(edge => edge.node)
  } catch (error) {
    console.error('Error fetching schools:', error)
    return []
  }
}

export async function getSchoolBySlug(slug) {
  try {
    const data = await graphcms.request(GET_SCHOOL_BY_SLUG, { slug })
    return data.school
  } catch (error) {
    console.error('Error fetching school by slug:', error)
    return null
  }
}

export async function getGalleriesBySchool(slug, first = 1, skip = 0) {
  try {
    const data = await graphcms.request(GET_GALLERIES_BY_SCHOOL, { 
      slug, 
      first, 
      skip 
    })
    return {
      galleries: data.galleriesConnection.edges.map(edge => edge.node),
      pageInfo: data.galleriesConnection.pageInfo
    }
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return { galleries: [], pageInfo: { hasNextPage: false } }
  }
}

export async function getPartners() {
  try {
    const data = await graphcms.request(GET_PARTNERS)
    return data.partnersConnection.edges.map(edge => edge.node)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return []
  }
}

// Helper function to transform school data for the 3D component
export function transformSchoolData(school) {
  return {
    schoolName: school.schoolName,
    year: school.schoolYear,
    slug: school.slug,
    theme: school.schoolTheme,
    location: school.schoolLocation,
    excerpt: school.excerpt,
    description: school.schoolDetails?.raw ? 
      school.schoolDetails.raw.children
        .filter(child => child.type === 'paragraph')
        .map(para => para.children.map(child => child.text).join(''))
        .join(' ') : '',
    coverImage: school.coverImage?.url || '/architecture_gif.gif',
    country: school.country,
    status: school.schoolStatus,
    instructors: school.instructors || []
  }
}
