import { getPartners } from '@/lib/schools'

export async function GET() {
  try {
    const partners = await getPartners()
    
    return Response.json({
      success: true,
      data: partners,
    })
  } catch (error) {
    console.error('API Error fetching partners:', error)
    return Response.json({ 
      success: false, 
      message: 'Failed to fetch partners' 
    }, { status: 500 })
  }
}
