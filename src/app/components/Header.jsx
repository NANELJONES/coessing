'use client'
import React, { useState, useEffect, useRef } from 'react'

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

  // Ocean images array
  const oceanImages = [
    '/gallery/1.jpg',
    '/Logo.webp', 
    '/gallery/3.jpg',
    '/gallery/4.jpg',
    '/gallery/5.jpg',
    '/gallery/6.jpg',
    '/gallery/7.jpg',
    '/gallery/8.jpg',
    '/gallery/4.jpg',
    '/gallery/2.jpg', 
  ]

  const threshold = 80

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const newPosition = getLocalPointerPos(e, rect)
      mousePosRef.current = newPosition
      
      // Initialize cache position on first move
      if (!isInitializedRef.current) {
        cacheMousePosRef.current = { ...newPosition }
        isInitializedRef.current = true
        startRender()
        startTimer()
      }
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Clean up trail images after animation
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setTrailImages(prev => prev.filter(img => Date.now() - img.id < 2000))
    }, 100)

    return () => clearInterval(cleanupInterval)
  }, [])

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

      <div className='md:hidden block w-full h-[300px] overflow-hidden'>
        <img src="/architecture_gif.gif" className='w-full h-full object-cover' alt="Architecture"></img>
      </div>


      <div className='flex items-center gap-[1em]  absolute left-0 top-0'> 
<div className='w-[100px] h-[2px] bg-white'></div>
<p className='text-white !text-sm font-thin'>Founded since-2015</p>
</div>

      <div className='md:absolute text-white flex  p-4  flex-col z-[50] gap-4 md:bottom-[7em] md:left-10 w-full md:w-2/3 relative'>
        <h1 className='text-4xl md:!text-[3.5em]'>Empowering Tomorrow's Ocean Scientists in West Africa</h1>
        <h6 className=''>One week immersive summer schools alternating between Ghana and Nigeria uniting researchers, fostering innovation, and amplifying African ocean science leadership</h6>
        <div className='flex gap-4 text-sm'>
          <button>Apply for 2025 School</button>
          <button>Learn More</button>
        </div>
      </div>
    </div>
  )
}

export default Header
