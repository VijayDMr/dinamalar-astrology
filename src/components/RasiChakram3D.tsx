'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { rasis, RasiData } from '../data/dinamalar-astrology';

// Prop interfaces
interface RasiChakram3DProps {
  onSelectRasi: (rasi: RasiData) => void;
  selectedRasiId: string;
}

// 1. Particle Starfield Background
function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1200;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45; // Z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.005;
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
        size={0.06}
        color="#F59E0B"
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

// 2. Central Sun / Ganesha Logo Medallion
function CentralMedallion() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      // Hovering up and down gently
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Golden Outer Ring */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1.1, 1.1, 0.15, 32]} />
        <meshStandardMaterial
          color="#D97706" // Golden amber
          metalness={0.9}
          roughness={0.1}
          emissive="#78350F"
        />
        {/* Glowing aura face */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 1.0, 32]} />
          <meshStandardMaterial
            color="#FEF08A" // Bright gold-yellow
            emissive="#EAB308"
            emissiveIntensity={1.5}
            roughness={0.2}
          />
        </mesh>
      </mesh>

      {/* Decorative center logo icon */}
      <Html position={[0, 0.15, 0]} center transform rotation={[Math.PI / 2, 0, 0]}>
        <div className="w-16 h-16 rounded-full bg-red-800 border-2 border-yellow-400 flex items-center justify-center shadow-lg select-none">
          {/* Sacred Sun-Ganesha SVG */}
          <svg viewBox="0 0 100 100" className="w-10 h-10 text-yellow-400 fill-current animate-pulse">
            <path d="M50,15 L53,35 L70,20 L60,40 L80,35 L65,48 L85,55 L65,58 L78,75 L58,63 L65,83 L51,68 L50,85 L49,68 L35,83 L42,63 L22,75 L35,58 L15,55 L35,48 L20,35 L40,40 L30,20 L47,35 Z M50,30 C39,30 30,39 30,50 C30,61 39,70 50,70 C61,70 70,61 70,50 C70,39 61,30 50,30 Z" />
            <circle cx="50" cy="50" r="10" className="text-red-800 fill-current" />
          </svg>
        </div>
      </Html>
    </group>
  );
}

// 3. Individual Rasi Card
interface CardProps {
  rasi: RasiData;
  index: number;
  total: number;
  selectedRasiId: string;
  onClick: (rasi: RasiData) => void;
  wheelRotation: number;
}

function RasiCard({ rasi, index, total, selectedRasiId, onClick, wheelRotation }: CardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.6; // Distance from center

  // Dynamic positioning along the 3D circle
  const targetX = Math.cos(angle) * radius;
  const targetZ = Math.sin(angle) * radius;

  const isSelected = selectedRasiId === rasi.id;

  useFrame((state) => {
    if (cardRef.current) {
      // Gently float hovered card up, and pull selected card slightly forward
      const hoverOffset = hovered ? 0.35 : 0;
      const selectOffset = isSelected ? 0.2 : 0;
      
      // Calculate current absolute angle of card in space including parent wheel rotation
      const absoluteAngle = angle + wheelRotation;
      
      // Face the camera: facing outwards along the circle
      cardRef.current.rotation.y = -absoluteAngle + Math.PI / 2;
      
      // Smoothly animate floating up/down
      const floatVal = Math.sin(state.clock.getElapsedTime() * 2 + index) * 0.06;
      cardRef.current.position.y = floatVal + hoverOffset;
      
      // Radial direction vector
      const radialX = Math.cos(angle);
      const radialZ = Math.sin(angle);
      
      cardRef.current.position.x = targetX + radialX * selectOffset;
      cardRef.current.position.z = targetZ + radialZ * selectOffset;
    }
  });

  return (
    <group ref={cardRef}>
      {/* 3D Glass Plane for physics/shadows */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(rasi)}
      >
        <planeGeometry args={[1.0, 1.4]} />
        <meshPhysicalMaterial
          color={isSelected ? "#7F1D1D" : hovered ? "#1E1B4B" : "#111827"}
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
        />
      </mesh>

      {/* HTML Content Overlay */}
      <Html center distanceFactor={7.5} pointerEvents="none">
        <div
          className={`w-28 h-40 flex flex-col items-center justify-between p-3 rounded-xl border transition-all duration-300 select-none cursor-pointer ${
            isSelected
              ? 'bg-gradient-to-b from-red-950/90 to-red-900/90 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-110'
              : hovered
              ? 'bg-gradient-to-b from-slate-900/90 to-amber-950/70 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105'
              : 'bg-black/75 border-red-900/40 shadow-md'
          }`}
        >
          {/* Constellation Glow Aura */}
          {isSelected && (
            <div className="absolute inset-0 rounded-xl bg-yellow-400/5 animate-pulse blur-xl" />
          )}

          {/* Rasi Index Indicator */}
          <div className="text-[10px] text-yellow-500 font-semibold font-mono tracking-widest opacity-80 uppercase">
            #{index + 1}
          </div>

          {/* Rasi Icon Symbol */}
          <div className={`text-4xl filter drop-shadow-md transform transition-transform ${hovered || isSelected ? 'scale-125' : ''}`}>
            {rasi.symbol}
          </div>

          {/* Tamil & English Name */}
          <div className="text-center">
            <div className="text-[14px] font-bold text-slate-100 tracking-wide font-sans leading-tight">
              {rasi.name}
            </div>
            <div className="text-[9px] text-yellow-400/80 font-mono tracking-wider font-semibold uppercase mt-0.5">
              {rasi.englishName}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// 4. Interactive Wheel Coordinator
function WheelGroup({ onSelectRasi, selectedRasiId }: RasiChakram3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { size, viewport } = useThree();
  const [rotationY, setRotationY] = useState(0);
  const rotationYRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const velocity = useRef(0);
  const lastTime = useRef(0);

  // Sync state to ref
  rotationYRef.current = rotationY;

  // Align card selection to front-center smoothly
  const [targetRotation, setTargetRotation] = useState<number | null>(null);

  useEffect(() => {
    // If a Rasi is selected externally, calculate the exact angle to rotate the wheel
    // so that this card sits front-center (which corresponds to angle = -Math.PI / 2)
    const activeIdx = rasis.findIndex(r => r.id === selectedRasiId);
    if (activeIdx !== -1 && !isDragging.current) {
      const cardAngle = (activeIdx / rasis.length) * Math.PI * 2;
      // We want cardAngle + currentWheelRotation = -Math.PI / 2
      const target = -cardAngle - Math.PI / 2;
      
      // Handle modular wrapping to rotate the shortest distance
      const diff = ((target - rotationYRef.current + Math.PI) % (Math.PI * 2)) - Math.PI;
      const adjustedTarget = rotationYRef.current + diff;
      
      setTargetRotation(adjustedTarget);
    }
  }, [selectedRasiId]);

  // Handle Drag / Touch Swipe Mechanics
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
    
    // Scale drag input to radial rotation speed
    const factor = 0.004;
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
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isDragging.current) {
        // Direct assignment during drag
        groupRef.current.rotation.y = rotationY;
      } else if (targetRotation !== null) {
        // Smoothly interpolate towards chosen card target rotation (LERP)
        const lerpSpeed = 5.0 * delta;
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
        // Friction decelaration for drag release inertia
        const friction = 0.94;
        velocity.current *= friction;
        if (Math.abs(velocity.current) > 0.0001) {
          groupRef.current.rotation.y += velocity.current * 16.0; // scale up to state
          setRotationY(groupRef.current.rotation.y);
        } else {
          velocity.current = 0;
          // Very gentle continuous background drift when idle
          groupRef.current.rotation.y += 0.0015;
          setRotationY(groupRef.current.rotation.y);
        }
      }
    }
  });

  const handleCardClick = (rasi: RasiData) => {
    // Select the clicked Rasi immediately
    onSelectRasi(rasi);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 3D Golden Wheel Track */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[3.6, 0.08, 16, 100]} />
        <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Render 12 Rasis */}
      {rasis.map((rasi, index) => (
        <RasiCard
          key={rasi.id}
          rasi={rasi}
          index={index}
          total={rasis.length}
          selectedRasiId={selectedRasiId}
          onClick={handleCardClick}
          wheelRotation={rotationY}
        />
      ))}
    </group>
  );
}

// 5. Root export containing Canvas and Orbit Camera configuration
export default function RasiChakram3D({ onSelectRasi, selectedRasiId }: RasiChakram3DProps) {
  return (
    <div className="w-full h-[380px] sm:h-[450px] relative select-none cursor-grab active:cursor-grabbing overflow-hidden">
      {/* Drag Tutorial Indicator */}
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
        {/* Soft Cosmic Background Lighting */}
        <ambientLight intensity={0.6} />
        <RadialLight />
        
        {/* Solar Flare Point Light */}
        <pointLight position={[0, 1.5, 0]} intensity={1.8} color="#F59E0B" decay={1.5} />
        
        {/* Key spotlights for glossy 3D card glare */}
        <spotLight position={[0, 8, 5]} angle={0.4} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={0.5} />

        {/* Ambient starfield elements */}
        <Starfield />

        {/* Medallion and interactive group */}
        <CentralMedallion />
        <WheelGroup onSelectRasi={onSelectRasi} selectedRasiId={selectedRasiId} />

        {/* Dynamic camera tilt settings */}
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

// Simple light helper to create depth
function RadialLight() {
  return (
    <mesh position={[0, -2, -5]}>
      <sphereGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#7F1D1D" transparent opacity={0.1} />
    </mesh>
  );
}
