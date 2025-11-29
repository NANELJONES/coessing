"use client"
import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HiLocationMarker } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { getSchools, transformSchoolData } from '@/lib/schools'
import CustomSubmarine from './CustomSubmarine'
// import Submarine from './Submarine'

// School Card Component with 3D-like effect using transforms
const SchoolCard = ({ school, scrollProgress, index, totalCards }) => {
  const router = useRouter()
  const ref = useRef()
  
  // Each card gets a distinct scroll range - ensuring all cards are covered
  const cardSegment = 1 / totalCards
  const cardStart = index * cardSegment
  const cardEnd = (index + 1) * cardSegment
  
  // Center point where card should be fully visible
  const cardCenter = cardStart + (cardSegment / 2)
  
  // Transition overlap - allow cards to overlap for smooth transitions
  // For first card: delay start slightly so it doesn't appear too early
  const transitionOverlap = cardSegment * 0.15
  // First card starts a bit into the scroll (at cardStart) to delay its appearance
  const visibleStart = index === 0 ? cardStart : Math.max(0, cardStart - transitionOverlap)
  const visibleEnd = index === totalCards - 1 ? 1 : Math.min(1, cardEnd + transitionOverlap)
  
  // Opacity: Each card should be visible during its segment with smooth transitions
  // First card fades in (doesn't start fully visible), last card should end visible
  const opacityValues = index === 0 
    ? [0, 0.4, 1, 0.4, 0] // First card: fades in like others (no special early visibility)
    : index === totalCards - 1
    ? [0, 0.4, 1, 1, 1] // Last card: visible until end
    : [0, 0.4, 1, 0.4, 0] // Middle cards: fade in and out
    
  const opacity = useTransform(scrollProgress, 
    [visibleStart, cardStart, cardCenter, cardEnd, visibleEnd],
    opacityValues
  )
  
  // Z-depth: Start far behind, come forward, then go back
  const z = useTransform(scrollProgress, 
    [visibleStart, cardStart, cardCenter, cardEnd, visibleEnd],
    [(index - totalCards) * 300, index * -300, 0, index * -300, (index - totalCards) * 300]
  )
  
  // Scale: Start small → continuously scale out (keep growing)
  const scale = useTransform(scrollProgress, 
    [visibleStart, cardStart, cardCenter, cardEnd, visibleEnd],
    [0.5, 0.7, 1.0, 1.2, 1.5]
  )
  
  // Y position: Slight offset for depth effect
  const y = useTransform(scrollProgress,
    [visibleStart, cardStart, cardCenter, cardEnd, visibleEnd],
    [index * 30, index * 15, 0, -index * 15, -index * 30]
  )
  
  // Rotation: Very subtle for 3D effect
  const rotateX = useTransform(scrollProgress,
    [visibleStart, cardStart, cardCenter, cardEnd, visibleEnd],
    [index * 3, index * 1.5, 0, -index * 1.5, -index * 3]
  )
  
  const handleClick = () => {
    if (school?.slug) {
      router.push(`/schools/${school.slug}`)
    }
  }
  
  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        opacity,
        y,
        rotateX,
        z,
        transformStyle: 'preserve-3d',
      }}
      className="absolute flex items-center justify-center  w-full"
     
    >
      <div className="relative group cursor-pointer w-full max-w-[850px]">
        {/* Glass Morphism Card - Modern & Sleek */}
        <div className="relative  p-4 md:p-12  w-full max-w-[850px] border border-white/20 hover:border-white/40  transition-all duration-500 overflow-hidden">
          {/* Glass overlay effect */}
          <div className="absolute inset-0 0  pointer-events-none"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-[1px] bg-gradient-to-br from-white/10 to-transparent  pointer-events-none opacity-50"></div>
          
          <div className="relative flex flex-col-reverse md:flex-row-reverse gap-12 z-10">
            {/* Left Side - Text Content */}
            <div className="flex-1 space-y-2 w-full">
              {/* Year - Large and prominent */}
              <div className="text-9xl text-white  leading-none">
                {school?.year || ''}
              </div>
              
              {/* School Name */}
              <h3 className="text-4xl font-light text-white leading-tight ">
                {school?.schoolName || ''}
              </h3>
              
              {/* Location */}
              <div className="flex items-center gap-3 text-white/80 text-sm font-normal tracking-wide">
                <HiLocationMarker className="w-5 h-5 text-white/60" />
                <span>{school?.location || ''}</span>
              </div>
              
              {/* Excerpt */}
              <p className="text-white !text-sm leading-relaxed max-w-md font-light">
                {school.excerpt ? `${school.excerpt.substring(0, 150)}...` : ''}
              </p>
              
              {/* Read More Button - Glass style */}
              <button  onClick={handleClick} className="!px-[3em] !py-2 border border-white/30 hover:bg-white/20 hover:border-white/50 text-white  rounded-xl transition-all duration-300 font-medium text-sm  shadow-lg hover:shadow-xl hover:scale-[1.02]">
                <span className="inline-flex  items-center gap-3">
                  Explore
                  <span className="group-hover/btn:translate-x-2 transition-transform text-lg">→</span>
                </span>
              </button>
            </div>
            
            {/* Right Side - Image with glass frame */}
            <div className="relative w-full md:w-[380px] h-[180px] md:h-full min-h-[200px] overflow-hidden flex-shrink-0 border border-white/20 shadow-xl">
              <img 
                src={school?.coverImage || ''} 
                alt={school?.schoolName || 'School Image'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Glass overlay on image */}

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const PrevSchools2 = () => {
  const containerRef = useRef()
  const spacerRef = useRef()
  const dummyRef = useRef(null)
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollReady, setScrollReady] = useState(false)
  
  // Choose target ref: before layout is ready, bind to a dummy ref to avoid premature measurements
  const targetRef = scrollReady ? containerRef : dummyRef
  
  // Scroll progress - tracks through the spacer height (not the container)
  // This ensures we get full scroll range through all cards
  // Delay start: begin tracking when sticky section is well into viewport (not at the very top)
  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"] // Standard offset for full range
  })
  
  // Add delay: shift scroll progress so it starts later (delays first card appearance)
  // Maps [0, 1] to [0.15, 1] so first 15% of scroll doesn't trigger animations
  const scrollYProgress = useTransform(rawScrollProgress, [0, 1], [0.15, 1])
  
  // Debug: log scroll progress (remove in production)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (window.DEBUG_SCROLL) {
        console.log('Scroll Progress:', latest)
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress])
  
  // Fetch schools data on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsData = await getSchools(7)
        const transformedSchools = schoolsData.map(transformSchoolData)
        setSchools(transformedSchools)
      } catch (error) {
        console.error('Error fetching schools:', error)
        setSchools([])
      } finally {
        setLoading(false)
        // Ensure DOM (including spacer height) has updated before enabling scroll tracking
        requestAnimationFrame(() => setScrollReady(true))
      }
    }
    
    fetchSchools()
  }, [])

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-primary_color to-[#103F56]">
        <div className="text-white text-2xl">Loading schools...</div>
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-primary_color to-[#103F56]">
        <div className="text-white text-2xl">No schools found.</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Fixed Title */}
      <div className="absolute top-8 left-8 z-40 pointer-events-none">
        <h1 className=" md:!text-[5em] text-white font-light ">Previous Schools</h1>
      </div>

      <CustomSubmarine scrollProgress={rawScrollProgress} />

      {/* Sticky container for cards - 3D Stack Effect */}
      <div 
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4 md:px-0 z-10" 
        style={{ 
          perspective: '2000px', 
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d'
        }}
      >
      
     
        <div className="relative w-full max-w-full h-full flex items-center justify-center">
          {schools.map((school, index) => (
            <SchoolCard
              key={school.year}
              school={school}
              scrollProgress={scrollYProgress}
              index={index}
              totalCards={schools.length}
            />
          ))}
        </div>
      </div>

      {/* Spacer for scroll effect - maps scroll height to go through all cards */}
      {/* Height should match the number of cards so each card gets equal scroll time */}
      {/* Add extra height to ensure we have enough scroll distance */}
      <div ref={spacerRef} style={{ height: `${Math.max(schools.length * 100, 700)}vh` }} />
    </div>
  )
}

export default PrevSchools2
