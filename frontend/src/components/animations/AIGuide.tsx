import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { GuideChatbox } from '../GuideChatbox';

export const WiseBerryAvatar = ({ hovered, isChatOpen, onClick, isFlipping, mini = false, mousePos }: { hovered: boolean, isChatOpen: boolean, onClick?: () => void, isFlipping?: boolean, mini?: boolean, mousePos?: React.MutableRefObject<{x: number, y: number}> }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      if (isFlipping) {
        // Fast backflip when clicked
        groupRef.current.rotation.x += 0.2;
      } else {
        // Reliable mouse tracking using the passed ref
        const mx = mousePos?.current ? mousePos.current.x : 0;
        const my = mousePos?.current ? mousePos.current.y : 0;
        
        const targetX = mx * (mini ? 0.4 : 0.6);
        const targetY = -my * (mini ? 0.4 : 0.6); // negative because y is inverted for rotation vs screen
        
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.1);
        
        // Random playful tilt if not chatting
        if (!isChatOpen) {
          groupRef.current.rotation.z = Math.sin(time * 2) * (mini ? 0.02 : 0.1);
        } else {
          groupRef.current.rotation.z = 0;
        }
      }

      // Squash and stretch scale effect on hover (only for main avatar)
      if (!mini) {
        const targetScaleX = hovered ? 1.05 : 1.0;
        const targetScaleY = hovered ? 0.95 : 1.0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScaleX, targetScaleY, targetScaleX), 0.1);
      }
    }
  });

  const content = (
    <group 
      ref={groupRef} 
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      scale={mini ? 0.8 : 1}
      position={mini ? [0, -0.2, 0] : [0, 0, 0]}
    >
        {/* Berry Body - Premium Jelly/Glass look */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial 
            color={hovered ? "#a855f7" : "#8b5cf6"} 
            emissive={hovered ? "#c084fc" : "#6d28d9"}
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            distort={0.1} 
            speed={2} 
          />
        </mesh>

        {/* Leaf Antenna (Makes it a berry!) */}
        <mesh position={[0, 1.15, 0]} rotation={[0.2, 0, 0.5]}>
          <coneGeometry args={[0.25, 0.8, 32]} />
          <meshPhysicalMaterial color="#34d399" roughness={0.4} clearcoat={0.5} />
        </mesh>
        
        {/* Secondary small leaf */}
        <mesh position={[0.1, 1.1, -0.1]} rotation={[-0.2, 0, -0.5]}>
          <coneGeometry args={[0.15, 0.5, 32]} />
          <meshPhysicalMaterial color="#10b981" roughness={0.4} clearcoat={0.5} />
        </mesh>

        {/* Glowing Glasses (Makes it "Wise") */}
        <group position={[0, 0.2, 1.15]} scale={1.1}>
          {/* Left Lens */}
          <mesh position={[-0.4, 0, 0]}>
            <torusGeometry args={[0.25, 0.04, 32, 100]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
          {/* Right Lens */}
          <mesh position={[0.4, 0, 0]}>
            <torusGeometry args={[0.25, 0.04, 32, 100]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Eyes (Inside Glasses) */}
        <mesh position={[-0.4, 0.2, 1.16]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.4, 0.2, 1.16]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>

        {/* Cute little mouth */}
        {hovered ? (
          <mesh position={[0, -0.2, 1.18]}>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.2} />
          </mesh>
        ) : (
          <mesh position={[0, -0.15, 1.18]} rotation={[0, 0, Math.PI]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#cbd5e1" emissive="#94a3b8" emissiveIntensity={0.2} />
          </mesh>
        )}

        {/* HTML Tooltip Bubble */}
        {!isChatOpen && !mini && (
          <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
            <div className={`transition-all duration-300 pointer-events-none w-max bg-white/95 text-indigo-600 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-[0_10px_25px_rgba(99,102,241,0.4)] border-2 border-indigo-400 flex items-center gap-2 transform ${hovered ? 'opacity-100 scale-110 -translate-y-2' : 'opacity-80 scale-90 translate-y-0'}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              I'm Berrywise!
            </div>
          </Html>
        )}
    </group>
  );

  return mini ? content : (
    <Float speed={hovered ? 6 : 3} rotationIntensity={0.2} floatIntensity={hovered ? 2 : 1}>
      {content}
    </Float>
  );
};

export const AIGuide: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [hovered, setHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Reliable global mouse tracking
  const mousePos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Random playful movements for the entire container
  const [randomPos, setRandomPos] = useState({ y: 0, rotate: 0 });

  useEffect(() => {
    if (isChatOpen || hovered) return;
    
    // Gentle bob instead of flipping upside down
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.7) {
        setRandomPos({
          y: Math.random() * 10, // slight peek
          rotate: (Math.random() - 0.5) * 5 // very slight natural tilt
        });
      } else {
        setRandomPos({ y: 0, rotate: 0 }); // settle back down
      }
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [isChatOpen, hovered]);

  const handleClick = () => {
    if (!isChatOpen) {
      setIsFlipping(true);
      setTimeout(() => {
        setIsFlipping(false);
        setIsChatOpen(true);
      }, 600);
    } else {
      setIsChatOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div 
          className="fixed z-50 pointer-events-auto"
          style={{ bottom: 20, right: 20, width: 100, height: 120 }}
          animate={{ 
            y: isChatOpen ? -10 : hovered ? -20 : randomPos.y,
            rotate: isChatOpen ? 0 : hovered ? 0 : randomPos.rotate,
            scale: isChatOpen ? 1 : hovered ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          {/* Hand-drawn Arrow Doodle pointing at Berrywise */}
          {!isChatOpen && (
            <motion.svg 
              initial={{ opacity: 0, x: -10, y: -10 }}
              animate={{ opacity: hovered ? 0 : 0.7, x: 0, y: 0 }}
              transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
              className="absolute -top-12 -left-16 w-20 h-20 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)] pointer-events-none" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Squiggly arrow curve */}
              <path d="M 10 20 Q 60 -10 80 60" />
              {/* Arrow head */}
              <path d="M 80 60 L 60 55 M 80 60 L 85 40" />
            </motion.svg>
          )}

          {/* Hand-drawn Sparkles Doodle */}
          {!isChatOpen && (
            <motion.svg 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: hovered ? 0 : 0.6, scale: 1, rotate: 10 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse', delay: 0.5 }}
              className="absolute top-4 -right-12 w-12 h-12 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)] pointer-events-none" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Star / Sparkle */}
              <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 25 25 L 75 75 M 25 75 L 75 25" />
            </motion.svg>
          )}
          
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ overflow: 'visible' }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-10, 5, -5]} intensity={1} color="#f43f5e" />
            
            <WiseBerryAvatar 
              hovered={hovered} 
              isChatOpen={isChatOpen} 
              onClick={handleClick}
              isFlipping={isFlipping}
              mousePos={mousePos}
            />
            
            <Sparkles 
              count={25} 
              scale={3} 
              size={hovered ? 6 : 3} 
              speed={0.8} 
              color={hovered ? "#34d399" : "#fb7185"} 
              opacity={0.8} 
            />
          </Canvas>
        </motion.div>
      </AnimatePresence>

      <GuideChatbox 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        apiUrl={apiUrl} 
      />
    </>
  );
};
