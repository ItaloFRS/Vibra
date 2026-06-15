"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/types/api";

interface EventCardProps {
  evento: Event;
}

export const EventCard = ({ evento }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex-shrink-0 w-[300px] h-[170px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The base card that remains in place */}
      <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 border border-white/5 relative">
         <Image
            src={evento.thumbnailUrl || "/placeholder-event.jpg"}
            alt={evento.title}
            fill
            className="object-cover opacity-50"
          />
      </div>

      {/* The expanding card */}
      <Link href={`/eventos/${evento.slug || evento.id}`}>
        <motion.div
          layoutId={`card-${evento.id}`}
          initial={false}
          animate={isHovered ? {
            scale: 1.1,
            height: 380,
            zIndex: 100,
            transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
          } : {
            scale: 1,
            height: 170,
            zIndex: 1,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          className="absolute top-0 left-0 w-full rounded-xl overflow-hidden bg-[#141414] border border-white/10 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
          style={{ originY: 0, originX: 0.5 }}
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={evento.thumbnailUrl || "/placeholder-event.jpg"}
              alt={evento.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            
            <AnimatePresence>
              {!isHovered && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 left-4 right-4"
                >
                  <h4 className="text-sm font-plus-bold text-white truncate">{evento.title}</h4>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expanded Info Content */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="px-6 py-5 flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="mr-auto text-[9px] font-plus-bold text-primary-container uppercase tracking-widest px-2 py-1 bg-primary/10 rounded border border-primary/20 ">
                    {evento.category}
                  </span>
                  <span className="text-[10px] font-plus-bold text-stone-500">
                    {new Date(evento.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                <h4 className="text-[16px] font-plus-ebold text-white mb-3 leading-tight">
                  {evento.title}
                </h4>
                
                <p className="text-[12px] text-stone-400 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {evento.description}
                </p>

                <div className="mt-auto flex items-center justify-between pb-2">
                  <div className="px-5 py-2.5 bg-white/10 text-white border border-white rounded font-extrabold text-[10px] tracking-[0.1em] uppercase hover:bg-orange-500 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                    Ingressos
                  </div>
                  <span className="text-[14px] font-extrabold text-white drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                    R$ {evento.minPrice || 0}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </div>
  );
};
