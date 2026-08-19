export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, location, message, siteName, siteLink } = body

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    // Log submission server-side (extend with email service like Resend/SendGrid as needed)
    console.log(`[Contact Form] New submission for ${siteName || 'COESSING'}`, {
      name,
      email,
      phone,
      location,
      siteName,
      siteLink,
    })

    // TODO: Integrate an email service (e.g. Resend, SendGrid) to forward messages to the COESSING inbox.
    // For now, we acknowledge receipt and log the submission.

    return Response.json({ success: true, message: 'Message received.' })
  } catch (error) {
    console.error('Contact API error:', error)
    return Response.json(
      { success: false, message: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
