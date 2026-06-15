"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/types/api";

interface EventHeroProps {
  eventos: Event[];
}

export const EventHero = ({ eventos }: EventHeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const currentEvent = eventos[currentIndex];

  useEffect(() => {
    if (eventos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eventos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [eventos.length]);

  if (!currentEvent) return null;

  return (
    <section ref={containerRef} className="relative h-[100vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div style={{ y }} className="relative h-[110%] w-full">
            <Image
              src={currentEvent.thumbnailUrl || "/placeholder-hero.jpg"}
              alt={currentEvent.title}
              fill
              priority
              className="object-cover brightness-[0.4] contrast-125"
            />
            {/* Glass Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 flex flex-col justify-center">
        <motion.div
          key={`info-${currentEvent.id}`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md text-[10px] font-plus-bold text-primary-container tracking-widest uppercase drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
              {currentEvent.category}
            </span>
            <span className="text-[10px] font-plus-bold text-stone-400 tracking-widest uppercase">
              {new Date(currentEvent.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </span>
          </div>

          <h1 className="text-7xl md:text-6xl font-plus-ebold tracking-tighter text-white mb-6 leading-[0.9]">
            {currentEvent.title.split(' ').map((word, i) => (
              <span key={i} className="mr-2">{word}</span>
            ))}
          </h1>

          <p className="text-lg text-stone-400 mb-10 max-w-lg font-medium tracking-tight leading-relaxed">
            {currentEvent.description}
          </p>

          <div className="flex items-center gap-6">
            <Link 
              href={`/eventos/${currentEvent.slug || currentEvent.id}`}
              className="px-10 py-4 bg-white/10 text-white border border-white rounded-full font-extrabold text-[11px] tracking-[0.2em] uppercase hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3"
            >
              Comprar Ingresso
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className="flex flex-col">
              <span className="text-[9px] font-plus-bold text-stone-500 uppercase tracking-widest mb-1">A partir de</span>
              <span className="text-xl font-plus-ebold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                R$ {currentEvent.minPrice || 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 right-12 z-20 flex gap-3">
        {eventos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="group relative h-1 w-12 bg-white/10 rounded-full overflow-hidden"
          >
            {currentIndex === i && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute inset-0 bg-primary origin-left"
              />
            )}
            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        ))}
      </div>
    </section>
  );
};
