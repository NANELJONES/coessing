'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

function WaveParticles({ count = 5000 }) {
  const meshRef = useRef();
  const instancedMeshRef = useRef();

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Create wave-like distribution - more particles in wave crests
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      
      // Create multiple wave layers
      const waveHeight = Math.sin(x * 0.1) * 2 + Math.cos(z * 0.15) * 1.5;
      const y = waveHeight + (Math.random() - 0.5) * 1.5;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Vary particle sizes - larger in wave crests
      const waveIntensity = Math.abs(waveHeight);
      scales[i] = 0.12 + waveIntensity * 0.08 + Math.random() * 0.04;
    }
    
    return { positions, scales };
  }, [count]);

  useFrame((state) => {
    if (instancedMeshRef.current) {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      const scale = new THREE.Vector3();
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        
        // Create multiple overlapping waves for more realistic ocean effect
        const wave1 = Math.sin(time * 1.2 + x * 0.12 + z * 0.08) * 2.5;
        const wave2 = Math.cos(time * 0.9 + x * 0.1 - z * 0.15) * 2.0;
        const wave3 = Math.sin(time * 1.8 + x * 0.18 + z * 0.12) * 1.5;
        const wave4 = Math.cos(time * 0.6 + x * 0.15 + z * 0.1) * 1.8;
        const wave5 = Math.sin(time * 2.1 + x * 0.2 + z * 0.18) * 1.2;
        const wave6 = Math.cos(time * 1.5 + x * 0.14 - z * 0.2) * 1.0;
        
        // Combine waves for complex ocean motion with more intensity
        const combinedWave = (wave1 + wave2 + wave3 + wave4 + wave5 + wave6) / 6;
        
        // Add foam effect - particles rise higher in wave crests
        const foamEffect = Math.max(0, combinedWave - 0.8) * 3;
        const y = combinedWave + foamEffect + Math.sin(time * 4 + i * 0.15) * 0.2;
        
        // Add horizontal drift for wave movement with more intensity
        const newX = x + Math.sin(time * 0.5 + z * 0.15) * 0.03;
        const newZ = z + Math.cos(time * 0.4 + x * 0.15) * 0.03;
        
        // Reset particles that drift too far
        const finalX = newX > 20 ? -20 : newX < -20 ? 20 : newX;
        const finalZ = newZ > 20 ? -20 : newZ < -20 ? 20 : newZ;
        
        position.set(finalX, y, finalZ);
        scale.setScalar(scales[i]);
        
        matrix.compose(position, new THREE.Quaternion(), scale);
        instancedMeshRef.current.setMatrixAt(i, matrix);
      }
      
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 12, 6]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent={true}
        opacity={0.6}
      />
    </instancedMesh>
  );
}

// Camera Controller Component - Beach eye-level perspective, moves forward on scroll
function CameraController() {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  
  useFrame(() => {
    // Get current scroll progress (0 to 1)
    const scrollProgress = scrollYProgress.get();
    
    // Camera at beach eye level (human eye height ~1.6-1.8)
    // Positioned on the beach, looking out at the ocean horizontally
    const cameraHeight = 1.7; // Eye level - stays constant
    const cameraZ = 15 - (scrollProgress * 10); // Move forward through ocean on scroll
    
    camera.position.set(0, cameraHeight, cameraZ);
    
    // Look horizontally ahead at eye level - slight downward angle to see ocean surface
    // This creates the beach perspective - standing looking out at the ocean
    camera.lookAt(0, 1.5, cameraZ - 3);
  });
  
  return null;
}

function OceanWaves() {
  return (
    <div className="fixed top-0 inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 1.7, 15], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <CameraController />
        <WaveParticles count={5000} />
      </Canvas>
    </div>
  );
}

export default OceanWaves;
