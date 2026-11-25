import { getTestimonialYears } from '@/lib/schools'

export async function GET() {
  try {
    const years = await getTestimonialYears()
    return Response.json({ success: true, data: years })
  } catch (error) {
    console.error('API Error fetching testimonial years:', error)
    return Response.json({ success: false, message: 'Failed to fetch years' }, { status: 500 })
  }
}
