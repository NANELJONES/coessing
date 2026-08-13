import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiMail, HiLocationMarker, HiExternalLink } from 'react-icons/hi'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary_color to-[#103F56] text-white px-4 md:px-8 py-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        <div>
          <h1 className="!text-[3em] md:!text-[6em] leading-none mb-4">Say Hello</h1>
          <p className="text-white/80 max-w-2xl">
            Reach the COESSING team for school inquiries, partnerships, press, and general questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-2xl">Contact</h2>
            <a href="mailto:coessing@gmail.com" className="flex items-center gap-3 hover:text-secondary_color">
              <HiMail className="w-5 h-5 shrink-0" />
              coessing@gmail.com
            </a>
            <div className="flex items-start gap-3">
              <HiLocationMarker className="w-5 h-5 mt-1 shrink-0" />
              <div>
                <p>University of Michigan</p>
                <p>Ann Arbor, MI 48109, USA</p>
                <p className="mt-2">Schools hosted in Ghana and Nigeria</p>
              </div>
            </div>
          </div>

          <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-2xl">Locations</h2>
            <div>
              <p className="uppercase text-xs tracking-wider text-white/60 mb-1">Ghana</p>
              <p>University of Ghana, Accra · Regional Maritime University</p>
            </div>
            <div>
              <p className="uppercase text-xs tracking-wider text-white/60 mb-1">Nigeria</p>
              <p>University of Lagos · NIOMR, Lagos</p>
            </div>
            <div>
              <p className="uppercase text-xs tracking-wider text-white/60 mb-1">United States</p>
              <p>University of Michigan, Ann Arbor</p>
            </div>
          </div>
        </div>

        <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6 md:p-8">
          <h2 className="text-3xl mb-3">Sister School: COES-WIO</h2>
          <p className="text-white/80 max-w-3xl mb-4">
            The Coastal Ocean Environment School in the Western Indian Ocean (COES-WIO) is COESSING’s sister school, launched in 2025 in Kenya. It extends the same capacity-sharing model across the Western Indian Ocean region.
          </p>
          <a
            href="https://www.coeswio.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary_color hover:underline"
          >
            Visit COES-WIO
            <HiExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6 md:p-8">
          <h2 className="text-3xl mb-4">Credits</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-24 h-24 shrink-0 bg-white p-2">
              <Image src="/Logo.webp" alt="COESSING logo" fill className="object-contain p-2" />
            </div>
            <div className="space-y-3 text-white/80 max-w-3xl">
              <p>
                The COESSING mark uses a circular ocean-wave emblem with the school name and its full title: Coastal Ocean Environment Summer School in Nigeria and Ghana.
              </p>
              <p>
                Website design and development by{' '}
                <a
                  href="https://kr8tos.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary_color hover:underline"
                >
                  KR8TOS
                </a>
                . Content draws from the legacy COESSING site, school archives, and partner publications.
              </p>
              <p className="text-white/60 text-sm">
                Legacy assets still welcome: original logo source files, earlier press clippings without public URLs (Ghana News Agency 2016, Koowa Media 2016, UNILAG Media 2022, 2016/2018 Ocean Sciences Meeting slides), and historical photo credits.
              </p>
            </div>
          </div>
        </div>

        <Link href="/" className="text-white/70 hover:text-white">
          ← Back home
        </Link>
      </div>
    </div>
  )
}

export default ContactPage
