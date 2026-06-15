"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TicketType {
  id: number;
  color: string;
  border: string;
  title: string;
  date: string;
  location: string;
}

const tickets: TicketType[] = [
  { id: 1, color: "rgba(251, 139, 63, 0.2)", border: "rgba(251, 139, 63, 0.4)", title: "VINTAGE FESTIVAL", date: "SÁB, 15 MAIO", location: "CAMPINA GRANDE" },
  { id: 2, color: "rgba(218, 201, 255, 0.2)", border: "rgba(218, 201, 255, 0.4)", title: "SÓ TRACK BOA", date: "DOM, 22 MAIO", location: "RECIFE" },
  { id: 3, color: "rgba(176, 15, 105, 0.2)", border: "rgba(176, 15, 105, 0.4)", title: "LOLLAPALOOZA", date: "SEX, 24 MARÇO", location: "SÃO PAULO" },
  { id: 4, color: "rgba(100, 78, 157, 0.2)", border: "rgba(100, 78, 157, 0.4)", title: "REVEILLON VIBRA", date: "SÁB, 31 DEZ", location: "JOÃO PESSOA" },
];

const Ticket = ({ ticket, index, scrollYProgress }: { ticket: TicketType; index: number; scrollYProgress: MotionValue<number> }) => {
  const totalTickets = tickets.length;

  // 🎬 Scroll animations (ajustado para cards maiores)
  const rotation = useTransform(scrollYProgress, [0.35, 0.5], [0, index * 10 - 15]);
  const translateX = useTransform(scrollYProgress, [0.35, 0.5], [0, index * 50 - 75]);
  const translateY = useTransform(scrollYProgress, [0.35, 0.5], [0, index * 25 - 30]);
  const scale = useTransform(scrollYProgress, [0.35, 0.5], [1 - index * 0.02, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 0.95], [0, 1, 1, 0]);

  // 🧊 Hover 3D
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 10;
    const rotateY = (x - centerX) / 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotate: rotation,
        x: translateX,
        y: translateY,
        scale: hovered ? 1.05 : scale,
        opacity,
        zIndex: totalTickets - index,

        // 🧊 3D
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: "preserve-3d",

        // 🎨 cores originais
        backgroundColor: ticket.color,
        borderColor: ticket.border,
      }}
      className={cn(
        "absolute w-[340px] md:w-[460px] lg:w-[520px] aspect-[16/9] rounded-[2rem] p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]",
        "backdrop-blur-3xl border border-white/10 transition-transform duration-200"
      )}
    >
      {/* ✨ Glow sutil */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[2rem]"
        style={{
          background: hovered
            ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 65%)"
            : "transparent",
        }}
      />

      {/* 🎟️ Recortes */}
      <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-black -translate-y-1/2 border-r border-white/5" />
      <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-black -translate-y-1/2 border-l border-white/5" />

      {/* 🔝 Top */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-plus-ebold text-lg text-white border border-white/10">
            V
          </div>
          <p className="text-[10px] tracking-[0.2em] font-plus-bold text-white/40 uppercase mt-2">
            {ticket.location}
          </p>
        </div>

        <span className="text-[10px] font-plus-bold text-white tracking-[0.1em] bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {ticket.date}
        </span>
      </div>

      {/* 🔥 Conteúdo */}
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-plus-ebold tracking-tight text-white mb-2">
          {ticket.title}
        </h3>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <span className="text-[8px] font-plus-bold text-white/30 tracking-[0.2em] uppercase">
            VIBRA PREMIUM
          </span>
        </div>
      </div>

      {/* 🌫️ Blur decorativo */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full" />
    </motion.div>
  );
};

export const EventWallet = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={containerRef} className="relative bg-black px-6 md:px-12 overflow-hidden">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* 📝 LEFT */}
          <div className="lg:col-span-6 z-10 order-2 lg:order-1">
            <motion.div
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8], [0, 1, 0]),
                y: useTransform(scrollYProgress, [0, 0.2], [20, 0]),
              }}
              className="space-y-8"
            >
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-plus-ebold tracking-tighter text-white leading-[0.9]">
                SUA <span className="text-primary-container">CARTEIRA</span> <br />
                DIGITAL.
              </h2>

              <p className="text-lg md:text-xl text-stone-500 max-w-lg font-medium tracking-tight leading-relaxed">
                Esqueça filas e e-mails perdidos. Seus eventos organizados em uma experiência 3D cinematográfica.
              </p>
            </motion.div>
          </div>

          {/* 🎴 RIGHT */}
          <div className="lg:col-span-6 relative h-[420px] md:h-[520px] flex items-center justify-center perspective-[2000px] order-1 lg:order-2">
            <div className="relative w-full h-full flex items-center justify-center">
              {tickets.map((ticket, index) => (
                <Ticket
                  key={ticket.id}
                  ticket={ticket}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};