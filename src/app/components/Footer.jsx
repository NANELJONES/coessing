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
    <div className='w-full bg-gradient-to-b backdrop-blur-xs  from-primary_color/80 to-primary_color py-16 px-8'>
      <div className="max-w-6xl mx-auto">
        {/* Let's Talk Section - Full Width */}
        <div className="text-center mb-16">
          <h1 className='text-white text-6xl md:!text-[8em] lg:!text-[12em] leading-none mb-8'>
            Let's talk
          </h1>
          <p className="text-white/80 text-lg  mx-auto leading-relaxed">
            Connect with us and be part of the ocean science community. 
            Follow our journey and stay updated with the latest news.
          </p>
        </div>

        {/* Contact Info & Social Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6 text-left">Get in Touch</h3>
            
            <div className="flex items-center gap-4 text-white/80">
              <HiMail className="w-5 h-5 text-secondary_color flex-shrink-0" />
              <span>hello@coessing.org</span>
            </div>
            
            <div className="flex items-center gap-4 text-white/80">
              <HiPhone className="w-5 h-5 text-secondary_color flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            
            <div className="flex items-start gap-4 text-white/80">
              <HiLocationMarker className="w-5 h-5 text-secondary_color flex-shrink-0 mt-1" />
              <div>
                <p>University of Michigan</p>
                <p>Ann Arbor, MI 48109</p>
                <p>Ghana & Nigeria</p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">Follow Us</h3>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 group"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <div className="text-white group-hover:text-secondary_color transition-colors duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

         {/* Bottom Section */}
         <div className="border-t border-white/20 pt-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
               <div className="relative w-12 h-12 flex-shrink-0">
                 <Image
                   src="/Logo.webp"
                   alt="COESSING Logo"
                   fill
                   className="object-contain"
                 />
               </div>
               <div className="text-white/60 text-sm">
                 <div>© 2025 COESSING. All rights reserved.</div>
                 <div className="mt-1">Coastal Ocean Environment Summer School in Nigeria and Ghana</div>
               </div>
             </div>
             
             <div className="text-white/60 text-sm text-center">
               <div className="mt-2">
                 Developed by{' '}
                 <a 
                   href="https://kr8tos.vercel.app/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-secondary_color hover:text-white transition-colors duration-300 font-medium"
                 >
                   KR8TOS
                 </a>
               </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  )
}

export default Footer