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
      // Mobile: pure steady rotation without pointer tracking so page scroll remains completely smooth
      meshRef.current.rotation.y += 0.0025;
      meshRef.current.rotation.x += 0.0012;
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
      rotationIntensity={isMobile ? 0.15 : 0.3}
      floatIntensity={isMobile ? 0.3 : 0.5}
    >
      <group ref={meshRef}>
        {/* Wireframe outer edges */}
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial
            color="#6366F1"
            transparent
            opacity={isMobile ? 0.65 : 0.5}
            linewidth={1}
          />
        </lineSegments>

        {/* Inner ambient glow shell */}
        <mesh geometry={innerGeometry}>
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Corner vertex nodes */}
        <points geometry={pointsGeometry}>
          <pointsMaterial
            color="#818CF8"
            size={isMobile ? 0.06 : 0.04}
            transparent
            opacity={0.85}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
}

/**
 * Static poster fallback for weak devices (concurrency <= 4) or prefers-reduced-motion.
 * Zero WebGL overhead, crisp SVG aesthetic that perfectly mirrors the 3D scene.
 */
export function HeroPosterFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent-2/10" />
      <div className="absolute h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />

      {/* Styled Geometric Vector Fallback */}
      <svg
        className="relative h-44 w-44 sm:h-56 sm:w-56 text-primary/70 animate-float-y"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <polygon points="50,10 88,32 88,72 50,92 12,72 12,32" stroke="currentColor" opacity="0.4" />
        <polygon points="50,18 80,36 80,68 50,84 20,68 20,36" stroke="currentColor" opacity="0.7" />
        <polygon points="50,26 72,39 72,63 50,76 28,63 28,39" stroke="hsl(var(--accent-2))" opacity="0.8" />
        <line x1="50" y1="18" x2="50" y2="84" stroke="currentColor" opacity="0.5" />
        <line x1="20" y1="36" x2="80" y2="68" stroke="currentColor" opacity="0.5" />
        <line x1="20" y1="68" x2="80" y2="36" stroke="currentColor" opacity="0.5" />
        <circle cx="50" cy="50" r="3" fill="#818CF8" />
        <circle cx="50" cy="18" r="2" fill="#6366F1" />
        <circle cx="80" cy="36" r="2" fill="#6366F1" />
        <circle cx="80" cy="68" r="2" fill="#6366F1" />
        <circle cx="50" cy="84" r="2" fill="#6366F1" />
        <circle cx="20" cy="68" r="2" fill="#6366F1" />
        <circle cx="20" cy="36" r="2" fill="#6366F1" />
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
            position: [0, 0, isMobile ? 6.5 : 6],
            fov: isMobile ? 42 : 45,
          }}
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
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
