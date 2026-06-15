"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { EventCard } from "../ui/EventCard";
import { Event } from "@/types/api";

interface EventRowProps {
  title: string;
  eventos: Event[];
}

export const EventRow = ({ title, eventos }: EventRowProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const scroll = (direction: "left" | "right") => {
    if (constraintsRef.current && contentRef.current) {
      const clientWidth = constraintsRef.current.clientWidth;
      const scrollWidth = contentRef.current.scrollWidth;
      const maxScroll = Math.max(0, scrollWidth - clientWidth + 40);
      
      const currentX = x.get();
      const scrollAmount = clientWidth * 0.8;
      
      let targetX = direction === "left" 
        ? currentX + scrollAmount 
        : currentX - scrollAmount;
      
      targetX = Math.min(0, Math.max(-maxScroll, targetX));
      
      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 35
      });
    }
  };

  if (eventos.length === 0) return null;

  return (
    <section 
      className="py-8 relative z-10 hover:z-30 transition-[z-index] duration-0"
    >
      <h3 className="text-2xl font-plus-ebold text-white tracking-tight px-4 mb-3">
        {title}
      </h3>

      <div className="relative group/row overflow-visible">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 h-[170px] w-14 z-[35] bg-black/80 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md border-r border-white/10 transition-all opacity-0 group-hover/row:opacity-100 rounded-r-xl shadow-2xl"
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          onClick={() => scroll("right")}
          className="absolute right-[-22] top-0 h-[170px] w-14 z-[35] bg-black/80 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md border-l border-white/10 transition-all opacity-0 group-hover/row:opacity-100 rounded-l-xl shadow-2xl"
          aria-label="Próximo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Drag Container */}
        <div 
          ref={constraintsRef}
          className="px-4 lg:pr-10 overflow-visible"
        >
          <motion.div
            ref={contentRef}
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={true}
            style={{ x }}
            className="flex gap-4 cursor-grab active:cursor-grabbing"
          >
            {eventos.map((evento) => (
              <div key={evento.id} className="flex-shrink-0">
                <EventCard evento={evento} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
