"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const HeroVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.5]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden rounded-[3rem] m-4">
      <motion.div style={{ y, opacity }} className="relative h-full w-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover brightness-[0.5] contrast-110"
        >
          <source 
            src="/hero-v.mp4" 
            type="video/mp4" 
          />
          <div className="absolute inset-0 bg-[#0C0A09]" />
        </video>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>
    </div>
  );
};
