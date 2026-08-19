"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { HiMail, HiLocationMarker, HiExternalLink } from 'react-icons/hi'

const EMPTY_FORM = { name: '', email: '', phone: '', location: '', message: '' }

const ContactPage = () => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setFeedback('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, siteName: 'COESSING', siteLink: 'https://coessing.org' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send.')
      setForm(EMPTY_FORM)
      setStatus('sent')
      setFeedback('Thank you. Your message has been sent.')
    } catch (err) {
      setStatus('error')
      setFeedback(err.message || 'Something went wrong. Please try again.')
    }
  }

  const field =
    'w-full border border-white/30 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/70'

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary_color to-[#103F56] text-white">
      <div className=" mx-auto px-4 md:px-8 pt-28 pb-16">

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT — all info */}
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="!text-[3em] md:!text-[5em] leading-none mb-4">Say Hello</h1>
              <p className="text-white/70 max-w-md leading-relaxed">
                Reach the COESSING team for school inquiries, partnerships, press, and general questions.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:coessing@gmail.com"
                className="flex items-center gap-3 text-white hover:text-secondary_color transition-colors"
              >
                <HiMail className="w-5 h-5 shrink-0" />
                coessing@gmail.com
              </a>
              <div className="flex items-start gap-3 text-white/80">
                <HiLocationMarker className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p>University of Michigan, Ann Arbor, MI 48109, USA</p>
                  <p className="text-white/60 text-sm">Schools hosted in Ghana and Nigeria</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/15 pt-8">
              <h2 className="text-xl mb-2">Sister School</h2>
              <p className="text-white/70 !text-sm leading-relaxed mb-3">
                COES-WIO — Coastal Ocean Environment School in the Western Indian Ocean — is COESSING's sister school, launched in 2025 in Kenya, extending the same capacity-sharing model to the Western Indian Ocean region.
              </p>
              <a
                href="https://www.coeswio.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary_color hover:underline text-sm"
              >
                Visit COES-WIO <HiExternalLink className="w-4 h-4" />
              </a>
            </div>

            <Link href="/" className="text-white/50 hover:text-white text-sm mt-auto">
              ← Back home
            </Link>
          </div>

          {/* RIGHT — form */}
          <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6 md:p-8">
            <h2 className="text-2xl mb-1">Send a message</h2>
            <p className="text-white/60 text-sm mb-6">We'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/70">Name</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} required autoComplete="name" className={field} />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/70">Email</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" className={field} />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/70">Phone</span>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" className={field} />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/70">Location</span>
                <input type="text" name="location" value={form.location} onChange={handleChange} autoComplete="address-level2" className={field} />
              </label>

              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs font-medium text-white/70">Message</span>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className={`${field} min-h-[120px] resize-y`} />
              </label>

              <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="primary_button px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60 !text-white"
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
                {feedback && (
                  <p className={`text-sm m-0 ${status === 'error' ? 'text-red-400' : 'text-white/70'}`}>
                    {feedback}
                  </p>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactPage
