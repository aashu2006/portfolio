"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

export const IdatenAnimation = () => {
  const revControls = useAnimationControls();
  const shouldReduceMotion = useReducedMotion();
  const [isRevving, setIsRevving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRev = async () => {
    if (shouldReduceMotion) return;
    if (isRevving) return;
    setIsRevving(true);
    await revControls.start({
      rotate: [0, -2, 1.5, -1, 0],
      scale: [1, 1.05, 0.97, 1.02, 1],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    setIsRevving(false);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="w-full relative h-28 mt-12 overflow-hidden"
    >
      {/* Road / track — wavy ink stroke matching the headers */}
      <div className="absolute bottom-6 left-0 right-0 h-3">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 10"
          preserveAspectRatio="none"
        >
          <path
            d="M0 5 Q 25 1, 50 5 T 100 5 T 150 5 T 200 5 T 250 5 T 300 5 T 350 5 T 400 5 T 450 5 T 500 5 T 550 5 T 600 5 T 650 5 T 700 5 T 750 5 T 800 5 T 850 5 T 900 5 T 950 5 T 1000 5"
            stroke="var(--hairline)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Flame Kaiser bike — loops left to right across the full viewport */}
      <motion.div
        className="absolute bottom-5"
        animate={
          shouldReduceMotion
            ? { x: "20px", y: 0 }
            : {
                x: ["-150px", "calc(100vw + 150px)"],
                y: [0, -4, 0, 4, 0],
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                x: {
                  duration: 9,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  duration: 0.45,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        {/* Rev/shake wrapper — only this responds to click */}
        <motion.div
          animate={revControls}
          onClick={handleRev}
          className="cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flame-kaiser.png"
            alt="Flame Kaiser"
            width={90}
            height={90}
            className="select-none pointer-events-auto"
            draggable={false}
            style={{
              filter: "drop-shadow(2px 4px 6px rgba(28,22,16,0.1))",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
