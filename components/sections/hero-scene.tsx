'use client';

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface SceneProps {
  isMobile?: boolean;
}

function WireframeMesh({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isMobile) {
      // Mobile: pure steady slow rotation without pointer tracking so page scroll remains completely smooth
      meshRef.current.rotation.y += 0.0022;
      meshRef.current.rotation.x += 0.001;
    } else {
      // Desktop: slow rotation + gentle mouse parallax
      const { pointer } = state;
      mouseRef.current.x = pointer.x * 0.25;
      mouseRef.current.y = pointer.y * 0.25;

      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.x += (mouseRef.current.x * 0.5 - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (mouseRef.current.y * 0.5 - meshRef.current.position.y) * 0.05;
    }
  });

  // Lower detail (detail = 0 for mobile, 1 for desktop) reduces segment & vertex overhead by ~70% on mobile
  const edgeGeometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.2, isMobile ? 0 : 1);
    return new THREE.EdgesGeometry(ico);
  }, [isMobile]);

  const innerGeometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.05, isMobile ? 0 : 1);
  }, [isMobile]);

  const pointsGeometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.25, isMobile ? 0 : 1);
  }, [isMobile]);

  return (
    <Float
      speed={isMobile ? 1.0 : 1.5}
      rotationIntensity={isMobile ? 0.12 : 0.3}
      floatIntensity={isMobile ? 0.25 : 0.5}
    >
      {/* On mobile, scale up slightly so it fills ~70% of the showcase card without dead space */}
      <group ref={meshRef} scale={isMobile ? 1.25 : 1.0}>
        {/* Wireframe outer edges */}
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial
            color="#6366F1"
            transparent
            opacity={isMobile ? 0.75 : 0.5}
            linewidth={1}
          />
        </lineSegments>

        {/* Inner ambient glow shell */}
        <mesh geometry={innerGeometry}>
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Corner vertex nodes */}
        <points geometry={pointsGeometry}>
          <pointsMaterial
            color="#818CF8"
            size={isMobile ? 0.07 : 0.04}
            transparent
            opacity={0.9}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
}

/**
 * Static poster fallback for weak devices (concurrency <= 4) or prefers-reduced-motion.
 * Zero WebGL overhead, crisp SVG aesthetic that fills ~70% of the card with ambient glow.
 */
export function HeroPosterFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/25 via-primary/5 to-transparent blur-2xl" />
      <div className="absolute h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />

      {/* Styled Geometric Vector Fallback */}
      <svg
        className="relative h-56 w-56 sm:h-64 sm:w-64 text-primary/75 animate-float-y"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <polygon points="50,8 90,31 90,73 50,94 10,73 10,31" stroke="currentColor" opacity="0.35" />
        <polygon points="50,16 82,35 82,69 50,86 18,69 18,35" stroke="currentColor" opacity="0.75" />
        <polygon points="50,25 74,38 74,64 50,77 26,64 26,38" stroke="hsl(var(--accent-2))" opacity="0.85" />
        <line x1="50" y1="16" x2="50" y2="86" stroke="currentColor" opacity="0.5" />
        <line x1="18" y1="35" x2="82" y2="69" stroke="currentColor" opacity="0.5" />
        <line x1="18" y1="69" x2="82" y2="35" stroke="currentColor" opacity="0.5" />
        <circle cx="50" cy="51" r="3.5" fill="#818CF8" />
        <circle cx="50" cy="16" r="2.5" fill="#6366F1" />
        <circle cx="82" cy="35" r="2.5" fill="#6366F1" />
        <circle cx="82" cy="69" r="2.5" fill="#6366F1" />
        <circle cx="50" cy="86" r="2.5" fill="#6366F1" />
        <circle cx="18" cy="69" r="2.5" fill="#6366F1" />
        <circle cx="18" cy="35" r="2.5" fill="#6366F1" />
      </svg>
    </div>
  );
}

export function HeroScene({ isMobile: forcedIsMobile }: SceneProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkCapabilities = () => {
      const mobile = forcedIsMobile !== undefined ? forcedIsMobile : window.innerWidth < 768;
      setIsMobile(mobile);

      // Check for prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Option B: Check for low-power device (concurrency <= 4 on mobile)
      const lowConcurrency =
        typeof navigator !== 'undefined' &&
        typeof navigator.hardwareConcurrency === 'number' &&
        navigator.hardwareConcurrency <= 4;

      // Check WebGL availability
      let hasWebGL = true;
      try {
        const canvas = document.createElement('canvas');
        hasWebGL = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        hasWebGL = false;
      }

      if (prefersReduced || !hasWebGL || (mobile && lowConcurrency)) {
        setUseFallback(true);
      } else {
        setUseFallback(false);
      }
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities, { passive: true });
    return () => window.removeEventListener('resize', checkCapabilities);
  }, [forcedIsMobile]);

  if (!mounted) {
    return <HeroPosterFallback />;
  }

  if (useFallback) {
    return <HeroPosterFallback />;
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden select-none"
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <Suspense fallback={<HeroPosterFallback />}>
        <Canvas
          camera={{
            position: [0, 0, isMobile ? 4.7 : 6],
            fov: isMobile ? 44 : 45,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? 'low-power' : 'high-performance',
          }}
          style={{
            width: '100%',
            height: '100%',
            touchAction: 'pan-y',
            pointerEvents: isMobile ? 'none' : 'auto',
          }}
        >
          <ambientLight intensity={0.25} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366F1" />
          <pointLight position={[-5, -5, 5]} intensity={0.35} color="#10B981" />
          <WireframeMesh isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}
