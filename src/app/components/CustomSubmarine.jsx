'use client'

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

// Submarine Model Component with animations
function SubmarineModel({ scrollProgress }) {
  // In development, add cache busting to see model changes without full page refresh
  // In production, remove the query parameter for better caching
  const modelPath = process.env.NODE_ENV === 'development' 
    ? `/3D/compressed submarine.glb?v=${Math.floor(Date.now() / 60000)}` // Updates every minute
    : '/3D/compressed submarine.glb'
  const { scene } = useGLTF(modelPath)
  const submarineRef = useRef()
  const modelRef = useRef()
  const propellerRef = useRef()
  const scrollRef = useRef(0)
  
  // Clone the scene to avoid conflicts when used multiple times
  const clonedScene = React.useMemo(() => scene.clone(), [scene])

  // Subscribe to parent scroll progress (MotionValue from framer-motion)
  useEffect(() => {
    if (!scrollProgress || !scrollProgress.on) return
    const unsub = scrollProgress.on('change', (v) => {
      scrollRef.current = v
    })
    return () => unsub()
  }, [scrollProgress])
  
  // Find the propeller mesh after the scene is cloned
  useEffect(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        // Look for exact name match first, then fallback to partial match
        if (child.isMesh && (child.name === 'propeller_mesh' || child.name.toLowerCase().includes('propeller'))) {
          propellerRef.current = child
          console.log('Found propeller mesh:', child.name)
        }
      })
    }
  }, [clonedScene])
  
  // Animation for submarine Z rotation, model Y rotation (4 -> 0), and Y position (forward movement)
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const rotateInDuration = 1.5 // seconds for model Y rotation to settle from 4 -> 0

    // Animate the 3D model's Y rotation from 4 to 0 at start
    if (modelRef.current) {
      const t = Math.min(time / rotateInDuration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const yRotation = 4 * (1 - eased)
      modelRef.current.rotation.y = yRotation
    }

    if (submarineRef.current) {
      // Create smooth oscillation - rotates left and right over 5 seconds
      // Use sine wave for smooth back-and-forth motion (5 second period)
      const oscillation = Math.sin((time * Math.PI * 2) / 5) * 0.4 // 0.4 radians (~23 degrees) oscillation
      
      // Apply base rotation + oscillating Z rotation
      submarineRef.current.rotation.z = 0.1 + oscillation

      // Map parent scroll progress (~30%) to group Y rotation 2 -> 3
      // Use a soft window [0.25, 0.45] for smoother interpolation
      const p = scrollRef.current || 0
      const start = 0.25
      const end = 0.45
      const clamped = Math.max(0, Math.min(1, (p - start) / (end - start)))
      const targetGroupY = 2 + clamped * 1 // 2 -> 3
      // Smoothly approach the target to avoid jitter
      const currentY = submarineRef.current.rotation.y
      submarineRef.current.rotation.y = currentY + (targetGroupY - currentY) * 0.12
      
      // Y position oscillation to simulate forward movement
      // Start forward motion only after model Y rotation settles
      if (time >= rotateInDuration) {
        const yOscillation = Math.sin((time * Math.PI * 2) / 4) * 0.3 // 0.3 units oscillation with 4 second period
        submarineRef.current.position.y = yOscillation

        // Add subtle Z position oscillation for depth movement (slower, smaller)
        const zOscillation = Math.sin((time * Math.PI * 2) / 8) * 0.2 // 0.2 units with 8 second period
        submarineRef.current.position.z = zOscillation

        // Add gentle Y rotation oscillation on the model after it settles at 0
        if (modelRef.current) {
          const yRotOsc = Math.sin((time * Math.PI * 2) / 6) * 0.15 // ~8.6 degrees peak
          modelRef.current.rotation.y = yRotOsc
        }
      }
    }
    
    // Continuous rotation for propeller (360 degrees on Y axis, fast spinning)
    if (propellerRef.current) {
      const time = state.clock.elapsedTime
      // Rotate 360 degrees continuously (2*PI per rotation)
      // 10 radians per second = ~1.6 rotations per second (fast spin)
      propellerRef.current.rotation.y = time * 10
    }
  })
  
  return (
    <group ref={submarineRef} rotation={[0.5, 1, 0.1]} position={[0, 0, 0]}>
      <primitive 
        object={clonedScene} 
        scale={1.4} 
        rotation={[0, 4, 0]}
        ref={modelRef}
        position={[0, 0, 0]}
      />
    </group>
  )
}

// Note: Preload is disabled to avoid cache issues during development
// Re-enable in production if needed: useGLTF.preload('/3D/compressed submarine.glb')

const CustomSubmarine = ({ scrollProgress }) => {
  return (
    <div className="sticky   top-[70%] translate-y-[-40%]  md:translate-y-0 md:top-[60%] md:left-[50%]  md:translate-x-[-50%] md:w-[700px] h-auto  md:h-full flex items-center justify-center pointer-events-none z-30">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, -5]} intensity={0.4} />
          <SubmarineModel scrollProgress={scrollProgress} />
          {/* Optional: Add controls for testing (comment out for production) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default CustomSubmarine
