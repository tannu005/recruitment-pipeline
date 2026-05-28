import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShaderLines } from './ShaderLines';
import { WavePrism } from './WavePrism';
import { Sparkles, Cpu, Database, Layout } from 'lucide-react';
import gsap from 'gsap';

const LOADING_STAGES = [
  { text: 'Syncing Data Models', icon: <Database className="w-4 h-4 text-white" /> },
  { text: 'Loading GraphQL Nodes', icon: <Cpu className="w-4 h-4 text-white" /> },
  { text: 'Initializing Classifiers', icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" /> },
  { text: 'Rendering Interface', icon: <Layout className="w-4 h-4 text-white" /> }
];

interface TransitionOverlayProps {
  isVisible: boolean;
  onMidpoint: () => void;
  onComplete: () => void;
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isVisible, onMidpoint, onComplete }) => {
  const [activeStage, setActiveStage] = useState(0);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (isVisible) {
      setActiveStage(0);
      progressRef.current.value = 0;

      const stageInterval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % LOADING_STAGES.length);
      }, 350);

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      tl.to(progressRef.current, {
        value: 1,
        duration: 2.5,
        ease: "power3.inOut",
      });

      const midpointTimeout = setTimeout(() => {
        onMidpoint();
      }, 1250); 

      return () => {
        clearInterval(stageInterval);
        clearTimeout(midpointTimeout);
        tl.kill();
      };
    }
  }, [isVisible, onMidpoint, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0B]"
        >
          {/* Deep Charcoal Radial Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1A1A1D] via-[#0A0A0B] to-black z-0 opacity-80" />

          {/* Removed R3F Canvas */}

          {/* Background GLSL Shader Lines (Monochrome) */}
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-10 grayscale">
            <ShaderLines />
          </div>

          {/* Liquid Refractive Wave Prism (Monochrome) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-[2] grayscale">
            <WavePrism />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-lg px-6 text-center select-none pointer-events-none">
            
            {/* Minimalist Rotating Loader */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-10" style={{ perspective: 800 }}>
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {LOADING_STAGES.map((stage, idx) => {
                  const angle = idx * (360 / LOADING_STAGES.length);
                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        transform: `rotateY(${angle}deg) translateZ(70px)`,
                        transformStyle: 'preserve-3d',
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#121214] border transition-all duration-500 ${
                        idx === activeStage ? 'border-[#D4AF37] scale-125' : 'border-white/10 opacity-30'
                      }`}
                    >
                      {stage.icon}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Premium Typography Transitions */}
            <div className="h-6 overflow-hidden relative w-full flex justify-center mb-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute text-[11px] font-light tracking-[0.3em] text-[#D4AF37] uppercase font-sans"
                >
                  {LOADING_STAGES[activeStage].text}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-mono mt-4 border-t border-white/5 pt-4 w-32">
              System Active
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
