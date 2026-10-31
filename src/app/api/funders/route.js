import { getFunders } from '@/lib/schools'

export async function GET() {
  try {
    const funders = await getFunders()

    return Response.json({
      success: true,
      data: funders,
    })
  } catch (error) {
    console.error('API Error fetching funders:', error)
    return Response.json(
      {
        success: false,
        message: 'Failed to fetch funders',
      },
      { status: 500 }
    )
  }
}
