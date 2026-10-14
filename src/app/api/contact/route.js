import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

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

    const project = siteName || 'COESSING'
    const toAddress = process.env.CONTACT_TO_EMAIL || 'coessing@gmail.com'
    const fromAddress = process.env.RESEND_FROM || 'info@coessing.org'

    if (!resend) {
      console.error('Contact API: RESEND_API_KEY is not configured')
      return Response.json(
        { success: false, message: 'Email service is not configured.' },
        { status: 500 }
      )
    }

    const { error } = await resend.emails.send({
      from: `${project} <${fromAddress}>`,
      to: [toAddress],
      replyTo: email,
      subject: `New contact message from ${name} (${project})`,
      text: [
        `Site: ${project}`,
        siteLink ? `Site link: ${siteLink}` : null,
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        location ? `Location: ${location}` : null,
        '',
        'Message:',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('Contact API Resend error:', error)
      return Response.json(
        { success: false, message: 'Failed to send your message. Please try again.' },
        { status: 500 }
      )
    }

    return Response.json({ success: true, message: 'Message received.' })
  } catch (error) {
    console.error('Contact API error:', error)
    return Response.json(
      { success: false, message: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
