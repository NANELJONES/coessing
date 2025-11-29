import { graphcms } from '@/lib/graphql'
import { GET_ALL_SCHOOLS_FOR_FILTERS } from '@/lib/queries'

export async function GET() {
  try {
    const data = await graphcms.request(GET_ALL_SCHOOLS_FOR_FILTERS)
    const schools = data.schoolsConnection.edges.map(edge => edge.node)
    
    // Extract unique values
    const uniqueYears = [...new Set(schools.map(s => s.schoolYear).filter(Boolean))].sort((a, b) => b - a)
    const uniqueCountries = [...new Set(schools.map(s => s.country).filter(Boolean))].sort()
    const uniqueStatuses = [...new Set(schools.map(s => s.schoolStatus).filter(Boolean))].sort()
    const uniqueLocations = [...new Set(schools.map(s => s.schoolLocation).filter(Boolean))].sort()
    
    return Response.json({
      success: true,
      data: {
        years: uniqueYears,
        countries: uniqueCountries,
        statuses: uniqueStatuses,
        locations: uniqueLocations
      }
    })
  } catch (error) {
    console.error('API Error fetching filters:', error)
    return Response.json({ 
      success: false, 
      message: 'Failed to fetch filter options' 
    }, { status: 500 })
  }
}

