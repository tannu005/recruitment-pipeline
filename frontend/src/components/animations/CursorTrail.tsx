import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CursorTrail: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // High-performance Framer Motion values for the cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Very elastic, playful spring physics
  const springConfig = { damping: 15, stiffness: 300, mass: 0.2 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.body.classList.contains("light-theme"));
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('input') ||
        target.tagName.toLowerCase() === 'select' ||
        target.closest('select') ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.closest('textarea')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* 
        Elastic Jelly Cursor
        Vibrant Fuchsia gradient, extremely bouncy, scales on hover/click.
      */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] flex items-center justify-center opacity-90 transition-colors ${
          isLightMode 
            ? "bg-gradient-to-tr from-pink-200/50 to-pink-300/50 border-2 border-pink-400/60 shadow-[0_0_18px_rgba(244,114,182,0.5)]" 
            : "bg-gradient-to-tr from-fuchsia-500 to-orange-500 mix-blend-screen"
        }`}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.8 : (isHovering ? 2.5 : 1),
          borderRadius: isHovering ? "30%" : "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      />
    </>
  );
};
