"use client";

import React, { useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { EventPurchaseHero } from "@/components/sections/event-purchase/EventPurchaseHero";
import { EventDetailsSection } from "@/components/sections/event-purchase/EventDetailsSection";
import { TicketSelector } from "@/components/sections/event-purchase/TicketSelector";
import { CartDrawer } from "@/components/sections/event-purchase/CartDrawer";
import { PaymentModal } from "@/components/sections/event-purchase/PaymentModal";
import { PurchaseSuccess } from "@/components/sections/event-purchase/PurchaseSuccess";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { EventPurchaseSkeleton } from "@/components/ui/EventPurchaseSkeleton";
import { useEventBySlug } from "@/hooks/use-api-data";

export default function EventPurchasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { isLoggedIn, openAuthModal } = useAuth();
  
  const { data: event, isLoading, isError } = useEventBySlug(slug);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (isLoading) return <EventPurchaseSkeleton />;
  if (isError || !event) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-plus-bold mb-4">Evento não encontrado</h2>
          <p className="text-stone-500">Ocorreu um erro ao carregar os detalhes do evento.</p>
        </div>
      </main>
    );
  }

  const tickets = event.ticketTypes;

  const cartCount = Object.values(cart).reduce((acc, q) => acc + q, 0);

  const updateQuantity = (ticketId: string, quantity: number) => {
    setCart(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
    if (quantity > 0 && !isCartOpen) {
      setTimeout(() => setIsCartOpen(true), 500);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (isLoggedIn) {
      setIsPaymentOpen(true);
    } else {
      openAuthModal();
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);
    setCart({}); // Clear cart
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      <EventPurchaseHero evento={event} />
      
      <EventDetailsSection evento={event} />
      
      <TicketSelector 
        tickets={tickets as any} 
        cart={cart} 
        onUpdateQuantity={updateQuantity} 
      />

      {/* Floating Cart Trigger (Desktop/Mobile) */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-12 right-12 z-50 p-6 bg-primary text-white rounded-full shadow-[0_0_50px_rgba(249,115,22,0.5)] group overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-sm font-black">{cartCount}</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" 
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        tickets={tickets as any}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        tickets={tickets as any}
        cart={cart}
      />

      {isSuccessOpen && (
        <PurchaseSuccess onClose={() => setIsSuccessOpen(false)} />
      )}

      <footer className="py-20 border-t border-white/5 text-center text-[10px] tracking-widest text-stone-600 uppercase">
        © 2026 VIBRA. EXPERIÊNCIA SEGURA E CRIPTOGRAFADA.
      </footer>
    </main>
  );
}
