import { getSchoolByParam } from '@/lib/schools'

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    // `slug` route param may be a CMS slug OR a school id
    const school = await getSchoolByParam(slug)
    
    if (!school) {
      return Response.json(
        { 
          success: false, 
          message: 'School not found' 
        },
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      data: school,
    })
  } catch (error) {
    console.error('API Error fetching school:', error)
    return Response.json({ 
      success: false, 
      message: 'Failed to fetch school' 
    }, { status: 500 })
  }
}

