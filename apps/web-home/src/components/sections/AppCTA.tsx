"use client";

import React from "react";
import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const AppCTA = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 overflow-hidden">
      {/* Cinematic Lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] font-plus-bold text-stone-400 tracking-[0.2em] uppercase">Disponível agora</span>
            </div>

            <h2 className="text-6xl md:text-9xl font-plus-ebold tracking-tighter text-white leading-[0.85]">
              O MUNDO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary bg-[length:200%_auto] animate-gradient">VIBRA</span> NO <br />
              SEU BOLSO.
            </h2>
            
            <p className="text-xl md:text-2xl text-stone-500 max-w-xl font-medium tracking-tight leading-relaxed">
              Leve a experiência social dos eventos para onde você for. 
              Encontre sua tribo e garanta seu lugar com um toque.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <button className="group flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-plus-bold transition-all hover:bg-stone-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Apple size={28} fill="currentColor" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase tracking-widest font-plus-ebold opacity-60">Baixar na</span>
                  <span className="text-xl">App Store</span>
                </div>
              </button>
              
              <button className="group flex items-center gap-4 px-10 py-5 bg-transparent text-white rounded-2xl font-plus-bold transition-all hover:bg-white/5 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-md">
                <Play size={28} fill="currentColor" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase tracking-widest font-plus-ebold opacity-60">Disponível no</span>
                  <span className="text-xl">Google Play</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Mockups */}
        <div className="lg:col-span-5 relative h-[700px] flex items-center justify-center perspective-[2000px]">
          {/* Decorative Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] border border-white/5 rounded-full"
          />

          {/* Main iPhone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: -20 }}
            viewport={{ once: true }}
            animate={{ 
              y: [0, -30, 0],
              rotateY: [-20, -15, -20]
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5, ease: [0.76, 0, 0.24, 1] },
              scale: { duration: 1.5, ease: [0.76, 0, 0.24, 1] }
            }}
            className="relative z-20 w-[300px] h-[620px] bg-[#1C1917] rounded-[3.5rem] border-[10px] border-[#292524] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Screen */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09] to-[#1C1917] p-4">
               {/* Inner UI elements */}
               <div className="w-20 h-6 bg-black rounded-full mx-auto mb-10" />
               <div className="space-y-6">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-[2.5rem] p-6 flex flex-col justify-end">
                     <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-md" />
                  </div>
                  <div className="h-6 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-6 w-1/2 bg-white/5 rounded-full" />
                  <div className="grid grid-cols-2 gap-4 pt-10">
                     <div className="h-32 bg-white/5 rounded-3xl" />
                     <div className="h-32 bg-white/5 rounded-3xl" />
                  </div>
               </div>
            </div>
            {/* Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Floating Element 1 - Notification */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -right-10 z-30 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-plus-ebold text-white text-sm">
              <Image src="/Logo_Vibra.png" alt="Vibra Logo" width={100} height={100} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Novo Match!</span>
                <span className="text-xs text-white font-plus-bold text-nowrap">Elena quer ir com você</span>
            </div>
          </motion.div>

          {/* Floating Element 2 - Ticket Icon */}
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 -left-20 z-30 w-16 h-16 bg-primary/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center rotate-12"
          >
            <div className="w-8 h-10 border-2 border-white/40 rounded flex items-center justify-center">
                <div className="w-4 h-0.5 bg-white/40" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
