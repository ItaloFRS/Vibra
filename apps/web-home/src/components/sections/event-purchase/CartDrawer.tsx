"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { TicketType } from "@/types/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: TicketType[];
  cart: Record<string, number>;
  onUpdateQuantity: (ticketId: string, quantity: number) => void;
  onCheckout: () => void;
}

export const CartDrawer = ({ isOpen, onClose, tickets, cart, onUpdateQuantity, onCheckout }: CartDrawerProps) => {
  const selectedTickets = tickets.filter(t => (cart[t.id] || 0) > 0);
  const subtotal = selectedTickets.reduce((acc, t) => acc + (t.price * cart[t.id]), 0);
  const serviceFee = subtotal * 0.1; // 10% fee
  const total = subtotal + serviceFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-orange-500/10 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black/60 backdrop-blur-3xl border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Seu Carrinho</h2>
              </div>
              <button 
                onClick={onClose} 
                aria-label="Fechar carrinho"
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-stone-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {selectedTickets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-stone-800 mb-6" />
                  <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest">Seu carrinho está vazio</p>
                </div>
              ) : (
                selectedTickets.map(ticket => (
                  <div key={ticket.id} className="group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">{ticket.name}</h3>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{ticket.batches?.[0]?.batchName || "Lote Único"}</p>
                      </div>
                      <button 
                        onClick={() => onUpdateQuantity(ticket.id, 0)}
                        aria-label={`Remover todos os ingressos ${ticket.name}`}
                        className="opacity-0 group-hover:opacity-100 p-2 text-stone-600 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1.5 border border-white/5">
                        <button 
                          onClick={() => onUpdateQuantity(ticket.id, cart[ticket.id] - 1)}
                          aria-label={`Diminuir quantidade de ${ticket.name}`}
                          className="text-stone-400 hover:text-white"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-white w-4 text-center">{cart[ticket.id]}</span>
                        <button 
                          onClick={() => onUpdateQuantity(ticket.id, cart[ticket.id] + 1)}
                          aria-label={`Aumentar quantidade de ${ticket.name}`}
                          className="text-stone-400 hover:text-white"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-black text-white">R$ {(ticket.price * cart[ticket.id]).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {selectedTickets.length > 0 && (
              <div className="p-8 bg-black/40 border-t border-white/10 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-stone-300">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-stone-500">Taxa de Serviço (10%)</span>
                    <span className="text-stone-300">R$ {serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Total</span>
                    <span className="text-3xl font-black text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={onCheckout}
                  aria-label="Finalizar compra"
                  className="w-full py-5 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 group"
                >
                  Finalizar Compra
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
