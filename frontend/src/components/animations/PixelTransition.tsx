import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const pixelShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2() },
    pixelSize: { value: 1.0 }, 
    progress: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    uniform float progress;
    varying vec2 vUv;

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 dxy = pixelSize / resolution;
      vec2 coord = dxy * floor(vUv / dxy);
      
      float noise = rand(coord);
      float dissolvePeak = sin(progress * 3.14159);
      
      if (noise < dissolvePeak * 0.8) {
        // Deep Charcoal instead of blue/indigo
        gl_FragColor = vec4(0.04, 0.04, 0.043, 0.8); 
      } else {
        vec4 texel = texture2D(tDiffuse, coord);
        // Desaturate slightly during transition for a more cinematic feel
        float gray = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
        vec3 finalColor = mix(texel.rgb, vec3(gray), dissolvePeak * 0.5);
        gl_FragColor = vec4(finalColor, texel.a);
      }
    }
  `
};

interface PixelTransitionProps {
  progress: number; // 0 to 1
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({ progress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(() => ({
    tDiffuse: { value: new THREE.Texture() }, 
    resolution: { value: new THREE.Vector2(size.width, size.height) },
    pixelSize: { value: 1.0 },
    progress: { value: 0.0 }
  }), [size]);

  useFrame(() => {
    if (materialRef.current) {
      // Much finer pixel size for luxury feel
      const peak = Math.sin(progress * Math.PI); 
      materialRef.current.uniforms.pixelSize.value = 1.0 + peak * 15.0; 
      materialRef.current.uniforms.progress.value = progress;
      materialRef.current.uniforms.resolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial 
        ref={materialRef}
        args={[pixelShader]}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};
