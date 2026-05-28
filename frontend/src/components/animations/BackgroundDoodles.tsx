import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundDoodles: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
      {/* Doodle 1: Star */}
      <motion.svg
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[15%] left-[10%] w-16 h-16 text-fuchsia-400/40"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M50 10 C55 40 60 45 90 50 C60 55 55 60 50 90 C45 60 40 55 10 50 C40 45 45 40 50 10 Z" />
      </motion.svg>

      {/* Doodle 2: Squiggle */}
      <motion.svg
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[20%] left-[5%] w-32 h-32 text-orange-400/30 -rotate-12"
        viewBox="0 0 200 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <motion.path d="M10,50 Q30,10 50,50 T90,50 T130,50 T170,50" />
      </motion.svg>

      {/* Doodle 3: Arrow */}
      <motion.svg
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-[25%] right-[15%] w-20 h-20 text-blue-400/40 rotate-45"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 80 Q50 20 80 20 M60 20 L80 20 L80 40" />
      </motion.svg>

      {/* Doodle 4: Swirl */}
      <motion.svg
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
        className="absolute bottom-[10%] right-[8%] w-24 h-24 text-fuchsia-500/30"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M50 50 m0 -40 a40 40 0 1 1 -1 0 a30 30 0 1 1 1 0 a20 20 0 1 1 -1 0 a10 10 0 1 1 1 0" />
      </motion.svg>

      {/* Doodle 5: Sparkles */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8, yoyo: Infinity }}
        className="absolute top-[40%] left-[2%] w-10 h-10 text-yellow-400/40"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M50 20 L50 80 M20 50 L80 50 M30 30 L70 70 M30 70 L70 30" />
      </motion.svg>
      
      {/* Doodle 6: Cloud/Bubbles */}
      <motion.svg
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute top-[60%] right-[3%] w-28 h-28 text-indigo-400/30"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M30 60 a20 20 0 0 1 0 -40 a25 25 0 0 1 45 5 a15 15 0 0 1 0 30 z" />
      </motion.svg>
    </div>
  );
};
