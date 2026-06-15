"use client";

import { Navbar } from "@/components/layout/Navbar";
import { EntryReveal } from "@/components/layout/EntryReveal";
import { HeroVideo } from "@/components/layout/HeroVideo";
import { AppCTA } from "@/components/sections/AppCTA";
import { EventWallet } from "@/components/sections/EventWallet";
import { EventCarousel } from "@/components/sections/EventCarousel";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <EntryReveal>
      <main className="relative min-h-screen overflow-hidden selection:bg-primary selection:text-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          <HeroVideo />
          
          <div className="relative z-10 max-w-7xl mx-auto text-center pt-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="text-[10px] tracking-[0.3em] font-plus-ebold text-primary-container uppercase">
                A Revolução Social dos Eventos
              </span>
            </motion.div>

            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="text-6xl sm:text-7xl md:text-9xl font-plus-ebold tracking-tighter mb-10 leading-[0.85] text-white"
            >
              VIVA O <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-container via-white to-secondary">MOMENTO.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="text-lg md:text-xl text-stone-400 mb-14 max-w-3xl mx-auto font-medium tracking-tight leading-relaxed"
            >
              Não compre apenas um ingresso. Conecte-se com pessoas incríveis e transforme cada evento em uma jornada social inesquecível.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                href="/eventos"
                className="group relative px-12 py-5 bg-white text-black rounded-full font-plus-ebold text-[11px] tracking-[0.2em] uppercase transition-all hover:bg-stone-200 overflow-hidden flex items-center justify-center"
              >
                <span className="relative z-10">Explorar Eventos</span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                />
              </Link>
              <button className="px-12 py-5 border border-white/10 text-white rounded-full font-plus-ebold text-[11px] tracking-[0.2em] uppercase hover:bg-white/5 transition-all">
                Saiba Mais
              </button>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] tracking-[0.3em] font-plus-bold text-stone-500 uppercase rotate-90 origin-left translate-x-1">SCROLL</span>
            <div className="w-px h-20 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        <AppCTA />
        <EventWallet />
        <EventCarousel />

        {/* Footer */}
        <footer className="py-5 bg-black border-t border-white/5 px-6 font-plus">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-30 h-30 bg-primary rounded-lg flex items-center justify-center font-plus-ebold text-xl text-white">
                <Image src="/Logo_Vibra.png" alt="Vibra Logo" width={100} height={100} />
              </div>
            </div>
            
            <div className="flex gap-10 text-[10px] tracking-[0.2em] font-plus-bold text-stone-500 uppercase">
              <Link href="#" className="hover:text-white transition-colors">Termos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-white transition-colors">Contato</Link>
            </div>

            <div className="text-[10px] tracking-[0.2em] font-plus-bold text-stone-600 uppercase text-center md:text-right">
              © 2026 VIBRA. TODOS OS DIREITOS RESERVADOS.
            </div>
          </div>
        </footer>
      </main>
    </EntryReveal>
  );
}
