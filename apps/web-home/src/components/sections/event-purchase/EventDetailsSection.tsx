"use client";

import React from "react";
import { motion } from "framer-motion";
import { Event } from "@/types/api";
import { Info, Users, Clock, ShieldCheck } from "lucide-react";

interface EventDetailsSectionProps {
  evento: Event;
}

export const EventDetailsSection = ({ evento }: EventDetailsSectionProps) => {
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Description & Info */}
        <div className="lg:col-span-7 space-y-16">
          <motion.div {...fadeInUp}>
            <div className="flex items-center gap-3 mb-6 text-primary">
              <Info className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Sobre o Evento</h2>
            </div>
            <p className="text-xl text-stone-400 leading-relaxed font-medium">
              {evento.description || "Sem descrição disponível."}
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-8 text-primary">
              <Users className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Line-Up</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evento.lineup?.length > 0 ? (
                evento.lineup.map((item) => (
                  <div key={item.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block mb-2">Atração</span>
                    <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors">{item.artistName}</h3>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-6 rounded-2xl bg-white/5 border border-white/10 text-stone-500 text-xs uppercase tracking-widest">
                  Line-up em breve
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Rules & Fast Info */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            {...fadeInUp}
            className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-8 text-white">
              <Clock className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Informações</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-6 border-bottom border-white/5">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Abertura dos Portões</span>
                <span className="text-sm font-black text-white">21:00</span>
              </div>
              <div className="flex justify-between items-center pb-6 border-bottom border-white/5">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Classificação</span>
                <span className="text-sm font-black text-white">18 Anos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Local</span>
                <span className="text-sm font-black text-white text-right">{evento.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-8 text-white">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Regras e Segurança</h2>
            </div>
            <ul className="space-y-4">
              {[
                'Proibida a entrada com objetos cortantes',
                'Obrigatória apresentação de documento com foto',
                'Ingresso nominal e intransferível',
                'Não nos responsabilizamos por itens perdidos'
              ].map((rule, i) => (
                <li key={i} className="flex gap-3 text-[11px] text-stone-400 font-medium leading-tight">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
