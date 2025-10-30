import React from 'react'
import Image from 'next/image'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
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
      url: 'https://www.linkedin.com/mwlite/company/coastal-ocean-environment-summer-school-in-nigeria-and-ghana',
      icon: <FaLinkedin className="w-6 h-6" />
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/COESSING/',
      icon: <FaFacebook className="w-6 h-6" />
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/ocean_summer_school/',
      icon: <FaInstagram className="w-6 h-6" />
    }
  ]

  return (
    <div className='w-full bg-white text-primary_color py-16 md:py-24 px-6 md:px-10 relative z-20'>
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="mb-16 md:mb-24">
          <h1 className=' text-6xl md:!text-[9em] lg:!text-[11em] leading-none'>
            Let's talk
          </h1>
        </div>

        {/* Big link grid (Kaleida-style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-16 md:mb-24">
          <div className="space-y-5">
            <a href="/" className="block  text-4xl md:text-6xl leading-none hover:opacity-80 transition">Home</a>
            <a href="/aboutUs" className="block  text-4xl md:text-6xl leading-none hover:opacity-80 transition">About</a>
            <a href="/resources" className="block  text-4xl md:text-6xl leading-none hover:opacity-80 transition">Resources</a>
          </div>
          <div className="space-y-5">
            <a href="/schools/ghana" className="block  text-4xl md:text-6xl leading-none hover:opacity-80 transition">Schools</a>
            <a href="/community-voice" className="block  text-4xl md:text-6xl leading-none hover:opacity-80 transition">Community</a>
            <a href="/testimonials" className="block  text-4xl md:text-6xl leading-none hover:opacity-80 transition">Testimonials</a>
          </div>
          <div>
            <div className="/70 uppercase tracking-wide text-sm mb-6">Say Hello</div>
            <div className="space-y-4 /90">
              <div className="flex items-center gap-3"><HiMail className="w-5 h-5 /70" /><span>hello@coessing.org</span></div>
              <div className="flex items-center gap-3"><HiPhone className="w-5 h-5 /70" /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-start gap-3"><HiLocationMarker className="w-5 h-5 /70 mt-1" /><div>
                <p>University of Michigan</p>
                <p>Ann Arbor, MI 48109</p>
                <p>Ghana & Nigeria</p>
              </div></div>
            </div>
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <div className="">{social.icon}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Addresses row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-white/15 pt-10 md:pt-12 mb-8">
          <div className="/60">
            <div className="uppercase text-xs tracking-wider mb-3">Ghana</div>
            <div>Accra</div>
          </div>
          <div className="/60">
            <div className="uppercase text-xs tracking-wider mb-3">Nigeria</div>
            <div>Lagos • Abuja</div>
          </div>
          <div className="/60">
            <div className="uppercase text-xs tracking-wider mb-3">United States</div>
            <div>University of Michigan,
              Ann Arbor, MI</div>
          </div>
          <div className="/60">
            <div className="uppercase text-xs tracking-wider mb-3">General inquiries</div>
            <div>hello@coessing.org</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-white/15 pt-6">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/Logo.webp" alt="COESSING Logo" fill className="object-contain" />
            </div>
            <div className="/60 text-sm">© 2025 COESSING. All rights reserved.</div>
          </div>
          <div className="/60 text-sm">
            Built by <a href="https://kr8tos.vercel.app/" target="_blank" rel="noopener noreferrer" className=" hover:opacity-80">KR8TOS</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer