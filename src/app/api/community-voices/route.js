import { getCommunityVoices } from '@/lib/schools'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const first = parseInt(searchParams.get('first') || '10', 10)
    const skip = parseInt(searchParams.get('skip') || '0', 10)

    const { items, pageInfo } = await getCommunityVoices(first, skip)

    return Response.json({ success: true, data: items, pageInfo })
  } catch (error) {
    console.error('API Error fetching community voices:', error)
    return Response.json({ success: false, message: 'Failed to fetch community voices' }, { status: 500 })
  }
}


