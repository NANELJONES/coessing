import { getSchoolPartners } from '@/lib/schools'

export async function GET() {
  try {
    const partners = await getSchoolPartners()

    return Response.json({
      success: true,
      data: partners,
    })
  } catch (error) {
    console.error('API Error fetching school partners:', error)
    return Response.json({
      success: false,
      message: 'Failed to fetch school partners',
    }, { status: 500 })
  }
}
