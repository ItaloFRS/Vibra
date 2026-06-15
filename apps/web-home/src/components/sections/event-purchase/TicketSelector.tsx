"use client";

import React from "react";
import { TicketType } from "@/types/api";
import { TicketCard } from "./TicketCard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TicketSelectorProps {
  tickets: TicketType[];
  cart: Record<string, number>;
  onUpdateQuantity: (ticketId: string, quantity: number) => void;
}

export const TicketSelector = ({ tickets, cart, onUpdateQuantity }: TicketSelectorProps) => {
  return (
    <section id="tickets-section" className="py-32 bg-black relative">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <Sparkles className="w-3 h-3 text-orange-500" />
            Ingressos Disponíveis
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Escolha sua <span className="text-primary">Experiência</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-xl font-medium tracking-tight">
            Selecione os ingressos desejados e prepare-se para vibrar. A compra é rápida, segura e 100% digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <TicketCard 
              key={ticket.id}
              ticket={ticket}
              quantity={cart[ticket.id] || 0}
              onAdd={() => onUpdateQuantity(ticket.id, (cart[ticket.id] || 0) + 1)}
              onRemove={() => onUpdateQuantity(ticket.id, Math.max(0, (cart[ticket.id] || 0) - 1))}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
