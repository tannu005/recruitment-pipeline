import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DomeGalleryProps {
  progress: number; // 0 to 1
}

export const DomeGallery: React.FC<DomeGalleryProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const numPanels = 12;
  const radius = 6;

  const panels = useMemo(() => {
    return Array.from({ length: numPanels }).map((_, i) => {
      const angle = (i / numPanels) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      return { position: new THREE.Vector3(x, 0, z), rotation: new THREE.Euler(0, angle, 0) };
    });
  }, [numPanels, radius]);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth cinematic spin
      groupRef.current.rotation.y = progress * Math.PI * 0.5 + state.clock.elapsedTime * 0.05;
      
      // Plunge depth
      groupRef.current.position.z = -12 + progress * 20;
      
      // Easing curve for scale pop-in
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const scale = Math.sin(easeProgress * Math.PI); 
      groupRef.current.scale.set(scale, scale, scale);
      
      // Floating bob effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {panels.map((panel, i) => (
        <mesh key={i} position={panel.position} rotation={panel.rotation}>
          <planeGeometry args={[2.5, 3.5, 32, 32]} />
          {/* Luxury Monochrome Glass Material */}
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.95} // Very clear glass
            opacity={1}
            metalness={0.2}
            roughness={0.1}
            ior={1.4}
            thickness={1.5}
            specularIntensity={1}
            specularColor={new THREE.Color("#D4AF37")} // Champagne Gold reflections
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Stark Museum Lighting */}
      <ambientLight intensity={0.1} color="#ffffff" />
      {/* Cool white rim light */}
      <pointLight position={[0, 0, 0]} intensity={10} color="#ffffff" distance={20} />
      {/* Dramatic Champagne Gold spotlight */}
      <directionalLight position={[5, 10, 5]} intensity={3} color="#D4AF37" />
    </group>
  );
};
