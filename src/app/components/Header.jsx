'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Helper functions
const getLocalPointerPos = (ev, rect) => ({
  x: ev.clientX - rect.left,
  y: ev.clientY - rect.top
})

const getMouseDistance = (pos1, pos2) => {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
}

const lerp = (start, end, factor) => {
  return start + (end - start) * factor
}

const Header = () => {
  const [trailImages, setTrailImages] = useState([])
  const containerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const cacheMousePosRef = useRef({ x: 0, y: 0 })
  const imgPositionRef = useRef(0)
  const zIndexValRef = useRef(1)
  const isInitializedRef = useRef(false)
  const timerRef = useRef(null)
  const lastTimerImageRef = useRef(0)
  const [mobileIndex, setMobileIndex] = useState(0)

  // Ocean images array
  const oceanImages = [
    '/gallery/1.JPG',
    '/gallery/9.jpg', 
    '/gallery/3.JPG',
    '/gallery/4.JPG',
    '/gallery/5.JPG',
    '/gallery/6.jpg',
    '/gallery/7.jpg',
    '/gallery/8.jpg',
    '/gallery/4.JPG',
    '/gallery/2.JPG', 
  ]

  const threshold = 80

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const newPosition = getLocalPointerPos(e, rect)
      mousePosRef.current = newPosition
    }
  }

  // Start the render loop
  const startRender = () => {
    const render = () => {
      const distance = getMouseDistance(mousePosRef.current, lastMousePosRef.current)
      
      // Smooth interpolation of cached position
      cacheMousePosRef.current.x = lerp(cacheMousePosRef.current.x, mousePosRef.current.x, 0.1)
      cacheMousePosRef.current.y = lerp(cacheMousePosRef.current.y, mousePosRef.current.y, 0.1)

      if (distance > threshold) {
        showNextImage()
        lastMousePosRef.current = { ...mousePosRef.current }
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }
    
    render()
  }

  // Start timer-based image generation
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      const now = Date.now()
      if (now - lastTimerImageRef.current >= 1000) { // 1 second interval
        showNextImage()
        lastTimerImageRef.current = now
      }
    }, 100) // Check every 100ms for more precise timing
  }

  // Show next image in trail
  const showNextImage = () => {
    // Cycle z-index between 1 and array.length * 2 to prevent unlimited growth
    const maxZIndex = oceanImages.length * 2
    zIndexValRef.current = zIndexValRef.current >= maxZIndex ? 1 : zIndexValRef.current + 1
    imgPositionRef.current = imgPositionRef.current < oceanImages.length - 1 ? imgPositionRef.current + 1 : 0
    
    const randomImage = oceanImages[imgPositionRef.current]
    const imageSize = 120 // Fixed size for images
    
    const newTrailImage = {
      id: Date.now() + Math.random(),
      x: cacheMousePosRef.current.x - imageSize / 2,
      y: cacheMousePosRef.current.y - imageSize / 2,
      targetX: mousePosRef.current.x - imageSize / 2,
      targetY: mousePosRef.current.y - imageSize / 2,
      image: randomImage,
      zIndex: zIndexValRef.current,
      opacity: 1
    }
    
    setTrailImages(prev => [...prev.slice(-9), newTrailImage])
    
    // Animate the image
    setTimeout(() => {
      setTrailImages(prev => prev.map(img => 
        img.id === newTrailImage.id 
          ? { ...img, x: img.targetX, y: img.targetY, opacity: 0 }
          : img
      ))
    }, 400)
  }

  // Initialize and Auto-start
  useEffect(() => {
    // Set initial position to center of screen
    if (typeof window !== 'undefined') {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      mousePosRef.current = { x: centerX, y: centerY }
      lastMousePosRef.current = { x: centerX, y: centerY }
      cacheMousePosRef.current = { x: centerX, y: centerY }
      
      // Start animations immediately
      startRender()
      startTimer()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Clean up trail images after animation
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setTrailImages(prev => prev.filter(img => Date.now() - img.id < 2000))
    }, 100)

    return () => clearInterval(cleanupInterval)
  }, [])

  // Mobile auto-rotate images (simulate static mouse by cycling images)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMobileIndex(prev => (prev + 1) % oceanImages.length)
    }, 1500)

    return () => clearInterval(intervalId)
  }, [oceanImages.length])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className='flex flex-col max-h-[1000px] justify-between gap-[2em] md:min-h-screen h-auto relative overflow-hidden'
      onMouseMove={handleMouseMove}
    >
      {/* Trail Images */}
      <div className='hidden md:block absolute inset-0 z-[1] pointer-events-none'>
      {trailImages.map((trailImage) => (
        <div
          key={trailImage.id}
          className='absolute w-full h-full max-w-[400px] max-h-[300px] pointer-events-none transition-all duration-400 ease-out'
          style={{
            left: trailImage.x,
            top: trailImage.y,
            zIndex: trailImage.zIndex,
            opacity: trailImage.opacity,
          }}
        >
          <img 
            src={trailImage.image} 
            alt="trail" 
            className='w-full h-full rounded-lg object-cover shadow-lg'
          />
        </div>
      ))}

    </div>

      <div className='md:hidden block w-full h-[300px] overflow-hidden relative'>
        {oceanImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === mobileIndex ? 'opacity-100' : 'opacity-0'}`}
            alt="Architecture"
          />
        ))}
      </div>


      <div className='flex items-center gap-[1em]  absolute left-0 top-0'> 
        <div className='w-[100px] h-[2px] bg-white'></div>
        <p className='text-white !text-sm font-thin'>Founded since-2015</p>
      </div>

      <motion.div 
        className='md:absolute text-white flex  p-4  flex-col z-[50] gap-4 md:bottom-[7em] md:left-10 w-full md:w-2/3 relative'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className='text-4xl md:!text-[3.5em]'
          variants={itemVariants}
        >
          Empowering Tomorrow's Ocean Scientists in West Africa
        </motion.h1>
        <motion.h6 
          className=''
          variants={itemVariants}
        >
          One week immersive summer schools alternating between Ghana and Nigeria uniting researchers, fostering innovation, and amplifying African ocean science leadership
        </motion.h6>
        <motion.div 
          className='flex gap-4 text-sm'
          variants={itemVariants}
        >
          <Link href='/schools'>
            <button className="hover:opacity-80 transition-opacity">Our Schools</button>
          </Link> 
          <Link href='/aboutUs' className="hover:opacity-80 transition-opacity">
         <button>Get to know us</button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Header
