'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { rasis } from '../data/fallback-data';
import { RasiData } from '../types/astrology';

// Prop interfaces
interface RasiChakram3DProps {
  onSelectRasi: (rasi: RasiData) => void;
  selectedRasiId: string;
}

// 1. Particle Starfield Background (Twinkling Stardust)
function CosmicBackground() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 55; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 55; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 55; // Z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#F59E0B"
        sizeAttenuation
        transparent
        opacity={0.65}
      />
    </points>
  );
}

// 2. Flowing Orbital Stardust Ring
function OrbitalStardust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;
  const radius = 3.65; // Matches the wheel radius

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const heightSpread = (Math.random() - 0.5) * 0.12;
      const radiusSpread = radius + (Math.random() - 0.5) * 0.15;
      
      pos[i * 3] = Math.cos(angle) * radiusSpread; // X
      pos[i * 3 + 1] = heightSpread; // Y
      pos[i * 3 + 2] = Math.sin(angle) * radiusSpread; // Z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Swirling drift effect along the orbit
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#FFFDE0"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3. Blazing Central Sun Core & Gyroscopic Gear Rings (Astronomical Orrery)
function CentralOrrery() {
  const sunRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const gear3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sunRef.current) {
      sunRef.current.rotation.y = t * 0.4;
      sunRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }
    if (gear1Ref.current) {
      // Rotate nested gear 1 on X/Y axis
      gear1Ref.current.rotation.y = t * 0.12;
      gear1Ref.current.rotation.x = t * 0.06;
    }
    if (gear2Ref.current) {
      // Rotate nested gear 2 in opposite direction on Z/Y axis
      gear2Ref.current.rotation.y = -t * 0.18;
      gear2Ref.current.rotation.z = t * 0.08;
    }
    if (gear3Ref.current) {
      // Outer horizontal planetary track ring
      gear3Ref.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group>
      {/* Blazing Core Sun Group */}
      <group ref={sunRef}>
        {/* Glowing Sun Sphere */}
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial color="#FFF999" />
        </mesh>
        
        {/* Soft Outer Golden Halo */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color="#FEF08A" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Gyroscopic Gear 1: Vertical Inclined Ring */}
      <mesh ref={gear1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.025, 8, 48]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.9}
          roughness={0.1}
          emissive="#78350F"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Gyroscopic Gear 2: Opposite Inclined Ring */}
      <mesh ref={gear2Ref} rotation={[-Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[1.35, 0.02, 8, 48]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.95}
          roughness={0.08}
          emissive="#451a03"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Gyroscopic Gear 3: Large Horizontal Dial Ring */}
      <mesh ref={gear3Ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[1.6, 0.03, 8, 64]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.9}
          roughness={0.15}
          emissive="#78350F"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// 4. Refractive 3D Hexagonal Gemstone Card
interface CardProps {
  rasi: RasiData;
  index: number;
  total: number;
  selectedRasiId: string;
  onClick: (rasi: RasiData) => void;
  wheelRotation: number;
}

function RasiHexagonGem({ rasi, index, total, selectedRasiId, onClick, wheelRotation }: CardProps) {
  const crystalRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.6; // Distance from center

  const targetX = Math.cos(angle) * radius;
  const targetZ = Math.sin(angle) * radius;

  const isSelected = selectedRasiId === rasi.id;

  useFrame((state) => {
    if (crystalRef.current) {
      const hoverOffset = hovered ? 0.38 : 0;
      const selectOffset = isSelected ? 0.28 : 0;
      
      const absoluteAngle = angle + wheelRotation;
      
      // Face the camera: flat face facing outwards along the circle
      crystalRef.current.rotation.y = -absoluteAngle + Math.PI / 2;
      
      // Floating animation
      const floatVal = Math.sin(state.clock.getElapsedTime() * 1.8 + index) * 0.04;
      crystalRef.current.position.y = floatVal + hoverOffset;
      
      // Pull card radially forward when hovered/selected
      const radialX = Math.cos(angle);
      const radialZ = Math.sin(angle);
      
      crystalRef.current.position.x = targetX + radialX * selectOffset;
      crystalRef.current.position.z = targetZ + radialZ * selectOffset;
    }
  });

  return (
    <group ref={crystalRef}>
      
      {/* 3D Shiny Golden Hexagonal Bezel Backing (6 segments) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.025]}>
        <cylinderGeometry args={[0.55, 0.55, 0.06, 6]} />
        <meshStandardMaterial
          color={isSelected ? "#FFF999" : hovered ? "#F59E0B" : "#78350F"}
          metalness={0.9}
          roughness={0.15}
          emissive={isSelected ? "#F59E0B" : hovered ? "#78350F" : "#1a0800"}
          emissiveIntensity={isSelected ? 1.4 : hovered ? 0.6 : 0.1}
        />
      </mesh>

      {/* 3D Refractive Glass Hexagonal Prism Face (6 segments) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(rasi)}
      >
        <cylinderGeometry args={[0.51, 0.52, 0.08, 6]} />
        <meshPhysicalMaterial
          color={isSelected ? "#420202" : hovered ? "#0c081f" : "#020308"}
          transparent
          opacity={0.35}
          roughness={0.12}
          metalness={0.1}
          transmission={0.9} // High-end glass refraction
          thickness={1.5}
          ior={1.65}
          clearcoat={1.0}
        />
      </mesh>

      {/* HTML Content Overlay */}
      <Html center distanceFactor={7.5} pointerEvents="none">
        <div
          className={`w-24 h-36 flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all duration-300 select-none cursor-pointer ${
            isSelected
              ? 'bg-gradient-to-b from-red-950/95 to-red-900/95 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.6)] scale-110'
              : hovered
              ? 'bg-gradient-to-b from-slate-950/95 to-amber-950/80 border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.4)] scale-105'
              : 'bg-black/75 border-red-900/30 shadow-md'
          }`}
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' // Crisp hexagonal HTML border clipping
          }}
        >
          {isSelected && (
            <div className="absolute inset-0 rounded-xl bg-yellow-400/5 animate-pulse blur-xl" />
          )}

          {/* Rasi Index */}
          <div className="text-[9px] text-yellow-500 font-extrabold font-mono tracking-widest opacity-80 uppercase mt-1">
            #{index + 1}
          </div>

          {/* Symbol */}
          <div className={`text-3.5xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transform transition-transform ${hovered || isSelected ? 'scale-120' : ''}`}>
            {rasi.symbol}
          </div>

          {/* Tamil & English Name */}
          <div className="text-center mb-1">
            <div className="text-[12px] font-extrabold text-slate-100 tracking-wide font-sans leading-tight">
              {rasi.name}
            </div>
            <div className="text-[8px] text-yellow-400/80 font-mono tracking-wider font-extrabold uppercase mt-0.5">
              {rasi.englishName}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// 5. Interactive Wheel Coordinator (With elastic snapping)
function WheelGroup({ onSelectRasi, selectedRasiId }: RasiChakram3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [rotationY, setRotationY] = useState(0);
  const rotationYRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const velocity = useRef(0);
  const lastTime = useRef(0);

  rotationYRef.current = rotationY;

  const [targetRotation, setTargetRotation] = useState<number | null>(null);

  // Sync active selection to front-center smoothly
  useEffect(() => {
    const activeIdx = rasis.findIndex(r => r.id === selectedRasiId);
    if (activeIdx !== -1 && !isDragging.current) {
      const cardAngle = (activeIdx / rasis.length) * Math.PI * 2;
      const target = -cardAngle - Math.PI / 2;
      
      const diff = ((target - rotationYRef.current + Math.PI) % (Math.PI * 2)) - Math.PI;
      const adjustedTarget = rotationYRef.current + diff;
      
      setTargetRotation(adjustedTarget);
    }
  }, [selectedRasiId]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = true;
    startX.current = e.clientX;
    velocity.current = 0;
    lastTime.current = performance.now();
    setTargetRotation(null);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    const currentX = e.clientX;
    const deltaX = currentX - startX.current;
    
    const factor = 0.0035; // Fine-tuned drag responsiveness
    const nextRot = rotationYRef.current + deltaX * factor;
    setRotationY(nextRot);
    
    const now = performance.now();
    const elapsed = now - lastTime.current;
    if (elapsed > 0) {
      velocity.current = (deltaX * factor) / elapsed;
    }
    
    startX.current = currentX;
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    
    // MATHEMATICAL MAGNETIC SNAP ALGORITHM
    // Calculate nearest Rasi index when drag finishes, and snap perfectly to it.
    const rawRotation = groupRef.current ? groupRef.current.rotation.y : rotationYRef.current;
    
    // Normalize rotation angle between 0 and 2*PI
    const normalizedAngle = (-rawRotation - Math.PI / 2) % (Math.PI * 2);
    const positiveAngle = normalizedAngle < 0 ? normalizedAngle + Math.PI * 2 : normalizedAngle;
    
    // Find closest index out of 12 Rasis
    const closestIdx = Math.round((positiveAngle / (Math.PI * 2)) * 12) % 12;
    const targetCard = rasis[closestIdx];

    // Trigger snapping and UI callback
    onSelectRasi(targetCard);
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isDragging.current) {
        groupRef.current.rotation.y = rotationY;
      } else if (targetRotation !== null) {
        // High-end Elastic Spring interpolation LERP
        const lerpSpeed = 6.0 * delta;
        const diff = targetRotation - groupRef.current.rotation.y;
        if (Math.abs(diff) < 0.001) {
          groupRef.current.rotation.y = targetRotation;
          setRotationY(targetRotation);
          setTargetRotation(null);
        } else {
          groupRef.current.rotation.y += diff * lerpSpeed;
          setRotationY(groupRef.current.rotation.y);
        }
      } else {
        // Inertia sliding
        const friction = 0.94;
        velocity.current *= friction;
        if (Math.abs(velocity.current) > 0.0001) {
          groupRef.current.rotation.y += velocity.current * 16.0;
          setRotationY(groupRef.current.rotation.y);
        } else {
          velocity.current = 0;
          // Gentle background celestial float drift when idle
          groupRef.current.rotation.y += 0.001;
          setRotationY(groupRef.current.rotation.y);
        }
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 3D Golden Wheel Clockwork gear tracks */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[3.6, 0.05, 12, 80]} />
        <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Render the 12 Gemstone Crystals */}
      {rasis.map((rasi, index) => (
        <RasiHexagonGem
          key={rasi.id}
          rasi={rasi}
          index={index}
          total={rasis.length}
          selectedRasiId={selectedRasiId}
          onClick={onSelectRasi}
          wheelRotation={rotationY}
        />
      ))}
    </group>
  );
}

// 6. Master Canvas Stage Wrapper
export default function RasiChakram3D({ onSelectRasi, selectedRasiId }: RasiChakram3DProps) {
  return (
    <div className="w-full h-[380px] sm:h-[450px] relative select-none cursor-grab active:cursor-grabbing overflow-hidden">
      
      {/* Drag Tutorial Badge */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-red-950/40 text-[11px] text-yellow-400 font-semibold tracking-wider flex items-center gap-2 shadow-lg z-10 pointer-events-none animate-pulse uppercase">
        <svg viewBox="0 0 24 24" className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
        <span>ராசியைத் தேர்வுசெய்ய சுழற்றவும் / தட்டவும்</span>
      </div>

      <Canvas
        camera={{ position: [0, 4.2, 5.8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <RadialLight />
        
        {/* Blazing solar flare illumination points */}
        <pointLight position={[0, 1.2, 0]} intensity={2.0} color="#F59E0B" decay={1.5} />
        
        {/* Glossy Spotlights for Hexagonal crystal flares */}
        <spotLight position={[0, 8, 4]} angle={0.45} penumbra={1} intensity={1.8} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={0.4} />

        {/* Twinkling starfield background */}
        <CosmicBackground />

        {/* Orbiting Stardust swirling streams */}
        <OrbitalStardust />

        {/* Sun and Gyroscopic clock rings */}
        <CentralOrrery />

        {/* Snap Coordinator and Hexagon Gemstones */}
        <WheelGroup onSelectRasi={onSelectRasi} selectedRasiId={selectedRasiId} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.3}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>
    </div>
  );
}

function RadialLight() {
  return (
    <mesh position={[0, -2, -5]}>
      <sphereGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#7F1D1D" transparent opacity={0.08} />
    </mesh>
  );
}
