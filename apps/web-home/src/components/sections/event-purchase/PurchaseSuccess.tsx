"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Ticket, Download, Share2 } from "lucide-react";
import Image from "next/image";

interface PurchaseSuccessProps {
  onClose: () => void;
}

export const PurchaseSuccess = ({ onClose }: PurchaseSuccessProps) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[300] flex items-center justify-center p-6 overflow-y-auto">
      {/* Celebration Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 }}
            className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(249,115,22,0.5)]"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
            Sua <span className="text-primary">Vibração</span> Está Garantida!
          </h1>
          <p className="text-stone-500 text-xs font-bold uppercase tracking-[0.3em]">Pedido #VIB-928374 confirmado</p>
        </div>

        {/* Ticket Preview Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl mb-12"
        >
          <div className="p-10 flex flex-col md:flex-row gap-10 items-center">
            {/* QR Code */}
            <div className="p-4 bg-white rounded-3xl shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative w-40 h-40">
              <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=vibra-ticket-success" alt="Ticket QR" fill className="p-4" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Ingresso Confirmado</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Baile do Dennis</h3>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div>
                  <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest mb-1">Data</p>
                  <p className="text-xs font-black text-white uppercase">12 JUN 2026</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest mb-1">Tipo</p>
                  <p className="text-xs font-black text-white uppercase">Frontstage</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest mb-1">Local</p>
                  <p className="text-xs font-black text-white uppercase">Arena Vibra</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Perforated edge effect */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-[-10px]">
            <div className="w-5 h-10 bg-black rounded-r-full -ml-3 border-r border-white/10" />
            <div className="w-5 h-10 bg-black rounded-l-full -mr-3 border-l border-white/10" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="py-5 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <Download className="w-4 h-4" />
            Baixar PDF
          </button>
          <button className="py-5 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
          <button 
            onClick={onClose}
            className="sm:col-span-2 py-6 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 group"
          >
            Ver Meus Ingressos
            <Ticket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Celebration Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
