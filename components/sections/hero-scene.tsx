'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function WireframeIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Track mouse for parallax
  useFrame((state) => {
    if (!meshRef.current) return;

    const { pointer } = state;
    mouseRef.current.x = pointer.x * 0.3;
    mouseRef.current.y = pointer.y * 0.3;

    // Slow rotation + mouse parallax
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.x += (mouseRef.current.x * 0.5 - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (mouseRef.current.y * 0.5 - meshRef.current.position.y) * 0.05;
  });

  const edgeGeometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.2, 1);
    return new THREE.EdgesGeometry(ico);
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef as any}>
        {/* Wireframe edges */}
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.5}
            linewidth={1}
          />
        </lineSegments>

        {/* Inner glow sphere */}
        <mesh>
          <icosahedronGeometry args={[2.1, 1]} />
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Vertex points */}
        <points>
          <icosahedronGeometry args={[2.25, 1]} />
          <pointsMaterial
            color="#818CF8"
            size={0.04}
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366F1" />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#10B981" />
        <WireframeIcosahedron />
      </Canvas>
    </div>
  );
}
