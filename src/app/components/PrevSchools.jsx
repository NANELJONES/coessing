"use client"
import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Html, useTexture } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HiLocationMarker, HiCalendar, HiPhotograph } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { getSchools, transformSchoolData } from '@/lib/schools'

// This will be replaced with dynamic data from GraphQL

// Enhanced 3D School Card Component - With Texture and Better Alignment
const SchoolCard3D = React.memo(({ school, position, index }) => {
  // Load texture from cover image
  const texture = useTexture(school.coverImage)
  const router = useRouter()
  
  // Redirect function
  const redirect = () => {
    router.push(`/schools/${school.slug}`)
  }
  
  return (
    <group position={position}>
      {/* Main Card Background - Semi-transparent gradient */}
      <mesh>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshBasicMaterial 
          color="#0F4C75" 
          transparent={true} 
          opacity={0.5}
        />
      </mesh>
      
      {/* Card Content Container */}
      <group position={[0, 0, 0.05]}>
        {/* Left Side Content */}
        <group position={[-3.5, -0.5, 0]}>
          {/* School Name */}
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="left"
            anchorY="middle"
            font="/Poppins/Poppins-Regular.ttf"
          >
            {school.schoolName}
          </Text>
          
          {/* Year */}
          <Text
            position={[0, 1, 0]}
            fontSize={0.8}
            color="white"
            anchorX="left"
            anchorY="middle"
            font="/Poppins/Poppins-Regular.ttf"
          >
            {school.year}
          </Text>
          
          {/* Location */}
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.2}
            color="white"
            anchorX="left"
            anchorY="middle"
            font="/Poppins/Poppins-Regular.ttf"
          >
            📍 {school.location}
          </Text>
          
          {/* Excerpt */}
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="white"
            anchorX="left"
            anchorY="middle"
            maxWidth={3}
            font="/Poppins/Poppins-Regular.ttf"
          >
            {school.excerpt.substring(0, 120)}...
          </Text>
          
          {/* Read More Button - 3D style with click function */}
          <mesh position={[0.6, -0.5, 0]} onClick={redirect}>
            <boxGeometry args={[1, 0.3, 0.05]} />
            <meshBasicMaterial color="#3B82F6" />
          </mesh>
          <Text
            position={[0.6, -0.5, 0.03]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/Poppins/Poppins-Regular.ttf"
          >
            Read More →
          </Text>
        </group>
        
        {/* Right Side Image with Texture */}
        <group position={[1.8, 0.3, 0]}>
          <mesh>
            <boxGeometry args={[3.5, 2.5, 0.05]} />
            <meshBasicMaterial 
              map={texture}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
})

// Camera Controller Component - Completely isolated with throttling
function CameraController() {
  const { camera } = useThree()
  const lastZ = useRef(camera.position.z)
  const targetZ = useRef(15)
  const lastUpdateTime = useRef(0)
  const THROTTLE_MS = 16 // ~60fps max
  
  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000
    
    // Throttle updates to prevent excessive re-renders
    if (now - lastUpdateTime.current < THROTTLE_MS) {
      return
    }
    
    // Smooth interpolation to reduce jank and flicker
    const smoothedZ = THREE.MathUtils.lerp(lastZ.current, targetZ.current, 0.15)
    
    // Only update if position actually changed to prevent unnecessary re-renders
    if (Math.abs(smoothedZ - lastZ.current) > 0.001) {
      camera.position.z = smoothedZ
      camera.lookAt(0, 0, smoothedZ - 1) // Look ahead, not at origin
      lastZ.current = smoothedZ
      lastUpdateTime.current = now
    }
  })
  
  // Store update function globally for external access
  React.useEffect(() => {
    window.updateCameraZ = (newZ) => {
      targetZ.current = newZ
    }
  }, [])
  
  return null
}

// Memoized Canvas component - NO PROPS AT ALL
const SchoolsCanvas = React.memo(({ schools }) => {
  // Pre-calculate card positions based on schools data
  const cardPositions = schools.map((_, i) => [0, 0, -i * 5])
  
  return (
  <Canvas 
    camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }} 
    style={{ background: 'transparent' }}
    dpr={[1, 1.5]} // Prevent very high DPI from overloading GPU
  >
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 5, 5]} intensity={0.8} />
    <directionalLight position={[-5, -5, -5]} intensity={0.4} />
    <CameraController />
      {schools.map((school, index) => (
      <SchoolCard3D
        key={school.year}
        school={school}
        position={cardPositions[index]}
        index={index}
      />
    ))}
  </Canvas>
  )
})

const PrevSchools = () => {
  const containerRef = useRef()
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"] // Start when component center enters viewport, end when component starts leaving
  })
  
  // Fetch schools data on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsData = await getSchools(7)
        const transformedSchools = schoolsData.map(transformSchoolData)
        setSchools(transformedSchools)
      } catch (error) {
        console.error('Error fetching schools:', error)
        // Fallback to empty array or default data
        setSchools([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchSchools()
  }, [])
  
  // Memoize camera calculation to prevent recalculation on every scroll
  const cameraRange = useMemo(() => {
    const totalCards = schools.length
    if (totalCards === 0) return 0
        const lastCardZ = -(totalCards - 1) * 5 // Last card position
        const cameraEndZ = lastCardZ - 4 // 2 units in front of last card
    return 15 - cameraEndZ // Total range needed
  }, [schools.length])
        
  // Throttled scroll handler to prevent excessive updates
  const throttledScrollHandler = useCallback((value) => {
    if (window.updateCameraZ) {
        const targetZ = 15 - (value * cameraRange)
        window.updateCameraZ(targetZ)
      }
  }, [cameraRange])
  
  // Update camera directly via global function to avoid Canvas re-renders
  React.useEffect(() => {
    let lastValue = 0
    let rafId = null
    
    const unsubscribe = scrollYProgress.on('change', (value) => {
      // Cancel previous RAF if it exists
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      
      // Use RAF to throttle updates
      rafId = requestAnimationFrame(() => {
        // Only update if value actually changed significantly
        if (Math.abs(value - lastValue) > 0.001) {
          throttledScrollHandler(value)
          lastValue = value
        }
      })
    })
    
    return () => {
      unsubscribe()
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [scrollYProgress, throttledScrollHandler])

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-2xl">Loading schools...</div>
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-2xl">No schools found.</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative min-h-screen w-full ">
      {/* Fixed Title */}
      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-4xl md:!text-[5em] text-white">Previous Schools</h1>
      </div>

      {/* 3D Canvas Container with Semi-transparent Background */}
      <motion.div
        className="sticky top-0 h-screen"
       
      >
        <SchoolsCanvas schools={schools} />
      </motion.div>

      {/* Spacer for scroll - reduced height */}
      <div className="h-[500vh]" />
    </div>
  )
}

export default PrevSchools
