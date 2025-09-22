import { getGalleriesBySchool } from '@/lib/schools'

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 0
    const limit = parseInt(searchParams.get('limit')) || 1
    
    const skip = page * limit
    const { slug } = await params
    
    const result = await getGalleriesBySchool(slug, limit, skip)
    
    return Response.json({
      success: true,
      data: result.galleries,
      pageInfo: result.pageInfo,
      pagination: {
        page,
        limit,
        skip,
        hasNextPage: result.pageInfo.hasNextPage
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch galleries',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
