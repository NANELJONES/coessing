import React from 'react'
import Image from 'next/image'
import { HiMail, HiLocationMarker } from 'react-icons/hi'
import { FaTwitter, FaYoutube, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/COESSING',
      icon: <FaTwitter className="w-6 h-6" />
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/channel/UChiCQrtC6U06ce3u_4aSKAQ/featured',
      icon: <FaYoutube className="w-6 h-6" />
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/coastal-ocean-environment-summer-school-in-nigeria-and-ghana/',
      icon: <FaLinkedin className="w-6 h-6" />
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/COESSING/',
      icon: <FaFacebook className="w-6 h-6" />
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/coess.ing/reels/',
      icon: <FaInstagram className="w-6 h-6" />
    }
  ]

  return (
    <div className='w-full bg-white text-primary_color py-10 px-6 md:px-10 relative z-20'>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Headline + Logo */}
        <div className="flex items-center justify-between gap-5">
          <h1 className='text-5xl md:!text-[7em] lg:!text-[8em] leading-none'>
            Let's talk
          </h1>
          <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-40 lg:h-40 flex-shrink-0">
            <Image src="/Logo.webp" alt="COESSING Logo" fill className="object-contain" />
          </div>
        </div>

        {/* Links + contact — single row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <a href="/" className="block text-xl leading-snug hover:opacity-70 transition">Home</a>
            <a href="/aboutUs" className="block text-xl leading-snug hover:opacity-70 transition">About</a>
            <a href="/resources" className="block text-xl leading-snug hover:opacity-70 transition">Resources</a>
          </div>
          <div className="space-y-2">
            <a href="/schools" className="block text-xl leading-snug hover:opacity-70 transition">Schools</a>
            <a href="/community-voice" className="block text-xl leading-snug hover:opacity-70 transition">Community</a>
            <a href="/testimonials" className="block text-xl leading-snug hover:opacity-70 transition">Testimonials</a>
            <a href="/contact" className="block text-xl leading-snug hover:opacity-70 transition">Contact</a>
          </div>
          <div className="space-y-2 text-sm col-span-2 md:col-span-2">
            <div className="uppercase tracking-wide text-xs opacity-60 mb-1">Say Hello</div>
            <a href="mailto:coessing@gmail.com" className="flex items-center gap-2 hover:opacity-70">
              <HiMail className="w-4 h-4 shrink-0" />coessing@gmail.com
            </a>
            <div className="flex items-start gap-2 opacity-80">
              <HiLocationMarker className="w-4 h-4 shrink-0 mt-0.5" />
              <span>University of Michigan, Ann Arbor, MI 48109 · Ghana & Nigeria</span>
            </div>
            <a href="https://www.coeswio.org" target="_blank" rel="noopener noreferrer" className="block opacity-70 hover:opacity-100">
              Sister school (2025): COES-WIO
            </a>
            <div className="flex gap-3 pt-1">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-primary_color/15 pt-4 text-xs opacity-60">
          <span>© {new Date().getFullYear()} COESSING. All rights reserved.</span>
          <span>Website built by <a href="https://kr8tos.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">KR8TOS</a></span>
        </div>

      </div>
    </div>
  )
}

export default Footer