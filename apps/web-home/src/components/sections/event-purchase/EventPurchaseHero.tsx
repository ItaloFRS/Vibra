"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Event } from "@/types/api";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface EventPurchaseHeroProps {
  evento: Event;
}

export const EventPurchaseHero = ({ evento }: EventPurchaseHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const minPrice = evento.minPrice || (evento.ticketTypes?.length > 0 
    ? Math.min(...evento.ticketTypes.map(t => t.price)) 
    : 0);

  return (
    <section ref={containerRef} className="relative h-[80vh] w-full overflow-hidden bg-black">
      <motion.div style={{ y, scale, opacity }} className="absolute inset-0">
        <Image
          src={evento.thumbnailUrl || "/placeholder-event.jpg"}
          alt={evento.title}
          fill
          priority
          className="object-cover brightness-[0.5] contrast-125"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      </motion.div>

      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-20">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-[10px] font-bold text-white tracking-[0.2em] uppercase drop-shadow-orange-500">
              {evento.category}
            </span>
            <div className="flex items-center gap-2 text-stone-300 text-[10px] font-bold tracking-widest uppercase">
              <Calendar className="w-3 h-3 text-primary" />
              {new Date(evento.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-[10px] font-bold tracking-widest uppercase">
              <MapPin className="w-3 h-3 text-primary" />
              {evento.location}
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.85] uppercase">
            {evento.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('tickets-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 bg-primary text-white bg-white/10 rounded-full font-black text-xs tracking-[0.25em] uppercase hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-4"
            >
              Comprar Ingresso
              <Ticket className="w-4 h-4" />
            </motion.button>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-1">A partir de</span>
              <div className="flex items-baseline gap-1">
                <span className="text-stone-400 text-sm font-bold">R$</span>
                <span className="text-4xl font-black text-white">{minPrice}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
};
