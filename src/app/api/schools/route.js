import { getSchools } from '@/lib/schools'

export async function GET() {
  try {
    const schools = await getSchools(50) // Get more schools for navigation
    
    return Response.json({
      success: true,
      data: schools,
    })
  } catch (error) {
    console.error('API Error fetching schools:', error)
    return Response.json({ 
      success: false, 
      message: 'Failed to fetch schools' 
    }, { status: 500 })
  }
}
