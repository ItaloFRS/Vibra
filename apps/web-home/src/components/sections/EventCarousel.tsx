"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { useEvents } from "@/hooks/use-api-data";
import { Skeleton } from "@/components/ui/Skeleton";

export const EventCarousel = () => {
  const { data: events, isLoading, isError } = useEvents();

  if (isError) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/50">Não foi possível carregar os eventos no momento.</p>
        </div>
      </section>
    );
  }

  // Double the events array for seamless infinite loop if we have events
  const carouselEvents = events?.slice(0, 6) || [];
  const duplicatedEvents = [...carouselEvents, ...carouselEvents];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex items-end justify-between">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-plus-ebold tracking-tighter text-white">
            EXPLORE O <br />
            <span className="text-secondary">PRÓXIMO</span> NÍVEL.
          </h2>
        </div>
        <Link href="/eventos" className="hidden sm:block text-xs font-plus-ebold tracking-[0.2em] text-white/50 hover:text-white transition-colors uppercase border-b border-white/10 pb-2">
          Ver todos os eventos
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative flex whitespace-nowrap">
        {isLoading ? (
          <div className="flex gap-8 px-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton 
                key={i} 
                className="w-[300px] md:w-[400px] aspect-[4/5] rounded-[2rem]" 
                data-testid="skeleton"
              />
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8"
          >
            {duplicatedEvents.map((event, index) => (
              <Link 
                key={`${event.id}-${index}`}
                href={`/eventos/${event.slug || event.id}`}
                className="block"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    z: 50,
                    transition: { duration: 0.4 }
                  }}
                  className="relative flex-shrink-0 w-[300px] md:w-[400px] aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Image
                    src={event.thumbnailUrl || "/placeholder-event.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-plus-ebold text-white tracking-tight leading-tight whitespace-normal">
                      {event.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] font-plus-bold text-white/60 tracking-widest uppercase">Ver Ingressos</span>
                        <div className="w-6 h-px bg-white/30" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
