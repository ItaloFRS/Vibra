"use client";

import React from "react";
import { motion } from "framer-motion";
import { TicketType } from "@/types/api";
import { Plus, Minus, CheckCircle2 } from "lucide-react";

interface TicketCardProps {
  ticket: TicketType;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export const TicketCard = ({ ticket, quantity, onAdd, onRemove }: TicketCardProps) => {
  const currentBatch = ticket.batches?.[0]?.batchName || "Lote Único";
  const isVip = ticket.name.toLowerCase().includes('vip');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
        quantity > 0 
          ? "bg-white/10 border-primary/50 shadow-[0_0_40px_rgba(249,115,22,0.1)]" 
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      {/* Selection Glow */}
      {quantity > 0 && (
        <div className="absolute top-0 right-0 p-6">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          {isVip && (
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
              Premium
            </span>
          )}
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            {currentBatch}
          </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{ticket.name}</h3>
        
        <ul className="mb-8 space-y-2 flex-1">
          <li className="text-[11px] text-stone-400 font-medium flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-stone-600" />
            Entrada garantida no evento
          </li>
          <li className="text-[11px] text-stone-400 font-medium flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-stone-600" />
            QR Code digital via App
          </li>
          {isVip && (
            <li className="text-[11px] text-stone-400 font-medium flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-stone-600" />
              Acesso à área VIP exclusiva
            </li>
          )}
        </ul>

        <div className="flex items-end justify-between pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1">Valor Unitário</span>
            <div className="flex items-baseline gap-1">
              <span className="text-stone-400 text-xs font-bold">R$</span>
              <span className="text-3xl font-black text-white">{ticket.price}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/40 rounded-full p-1 border border-white/10">
            <button 
              onClick={onRemove}
              disabled={quantity === 0}
              aria-label="Remover ingresso"
              className={`p-2 rounded-full transition-all ${
                quantity > 0 ? "text-white hover:bg-white/10" : "text-stone-700 cursor-not-allowed"
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-white min-w-[1.5rem] text-center">
              {quantity}
            </span>
            <button 
              onClick={onAdd}
              aria-label="Adicionar ingresso"
              className="p-2 rounded-full text-white hover:bg-white/10 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
};
