'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const GALLERY_IMAGES = [
  '/gallery/1.JPG',
  '/gallery/2.JPG',
  '/gallery/3.JPG',
  '/gallery/4.JPG',
  '/gallery/5.JPG',
  '/gallery/6.jpg',
  '/gallery/7.jpg',
  '/gallery/8.jpg',
  '/gallery/9.jpg',
]

const Header = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % GALLERY_IMAGES.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative flex flex-col w-full h-[100vh] max-h-[100vh] gap-5 md:gap-6 overflow-hidden">
      {/* Top text row — natural height */}
      <div className="relative z-[2] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full shrink-0">
        {/* Left — eyebrow + headline */}
        <motion.div
          className="text-white flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-[1em]">
            <div className="w-[100px] h-[2px] bg-white" />
            <p className="text-white !text-sm font-thin">Founded since-2015</p>
          </div>
          <h1 className="text-4xl md:!text-[3.2em] leading-tight">
            Empowering Tomorrow&apos;s Ocean Scientists in West Africa
          </h1>
        </motion.div>

        {/* Right — subheading + buttons */}
        <motion.div
          className="text-white flex flex-col gap-5 md:justify-end md:items-start md:pt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <h6 className="text-white/90 leading-relaxed max-w-lg">
            One week immersive summer schools alternating between Ghana and Nigeria uniting researchers, fostering innovation, and amplifying African ocean science leadership
          </h6>
          <div className="flex gap-4 text-sm">
            <Link href="/schools">
              <button className="hover:opacity-80 transition-opacity">Our Schools</button>
            </Link>
            <Link href="/aboutUs" className="hover:opacity-80 transition-opacity">
              <button>Get to know us</button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Image fills remaining viewport height */}
      <div className="relative z-[1] w-full flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={GALLERY_IMAGES[index]}
            src={GALLERY_IMAGES[index]}
            alt="COESSING"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Header
