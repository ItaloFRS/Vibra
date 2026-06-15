"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Landmark, Smartphone, ShieldCheck, ArrowRight, ChevronLeft, AlertCircle } from "lucide-react";
import { TicketType } from "@/types/api";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const userInfoSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (000.000.000-00)"),
  email: z.string().email("E-mail inválido"),
});

const cardSchema = z.object({
  number: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Cartão inválido"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Data inválida (MM/AA)"),
  cvv: z.string().min(3, "CVV inválido").max(4),
});

type UserInfoData = z.infer<typeof userInfoSchema>;
type CardData = z.infer<typeof cardSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tickets: TicketType[];
  cart: Record<string, number>;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess, tickets, cart }: PaymentModalProps) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "apple" | null>(null);

  const selectedTickets = tickets.filter(t => (cart[t.id] || 0) > 0);
  const subtotal = selectedTickets.reduce((acc, t) => acc + (t.price * cart[t.id]), 0);
  const total = subtotal * 1.1;

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
  } = useForm<UserInfoData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      nome: "Italo Ferreira",
      email: "italo@vibra.com"
    }
  });

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    formState: { errors: cardErrors },
  } = useForm<CardData>({
    resolver: zodResolver(cardSchema),
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onSubmitUser = (data: UserInfoData) => {
    console.log("User Info:", data);
    nextStep();
  };

  const onSubmitCard = (data: CardData) => {
    console.log("Card Info:", data);
    nextStep();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[250]"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-0 m-auto w-full max-w-4xl h-fit max-h-[95vh] overflow-y-auto bg-black/80 backdrop-blur-3xl border border-white/10 z-[251] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Border Glow Effect */}
            <div className="absolute inset-0 border border-primary/20 rounded-[3rem] pointer-events-none" />
            <div className="absolute inset-0 border border-white/5 rounded-[3rem] pointer-events-none" />
            
            {/* Left: Summary (Desktop) */}
            <div className="hidden md:flex w-80 bg-white/5 border-r border-white/5 p-12 flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-10">Resumo</h3>
              <div className="space-y-6 flex-1">
                {selectedTickets.map(t => (
                  <div key={t.id}>
                    <p className="text-white text-sm font-black uppercase tracking-tight">{t.name}</p>
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{cart[t.id]}x — R$ {t.price * cart[t.id]}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mb-2">Total a pagar</p>
                <p className="text-4xl font-black text-white">R$ {total.toFixed(0)}</p>
              </div>
            </div>

            {/* Right: Checkout Flow */}
            <div className="flex-1 p-8 md:p-16 relative">
              <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-colors text-stone-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>

              {step > 1 && (
                <button onClick={prevStep} className="absolute top-8 left-8 md:left-16 p-2 rounded-full hover:bg-white/5 transition-colors text-stone-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              )}

              <div className="mt-8">
                {/* Step Indicator */}
                <div className="flex gap-2 mb-12">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-primary" : "bg-white/10"}`} />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="space-y-8"
                    >
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Dados Pessoais</h2>
                      <form onSubmit={handleSubmitUser(onSubmitUser)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-4">Nome Completo</label>
                            <input 
                              {...registerUser("nome")}
                              type="text" 
                              className={`w-full bg-white/5 border ${userErrors.nome ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-primary/50`} 
                            />
                            {userErrors.nome && <span className="text-[9px] text-red-500 font-bold uppercase ml-4">{userErrors.nome.message}</span>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-4">CPF</label>
                            <input 
                              {...registerUser("cpf")}
                              type="text" 
                              placeholder="000.000.000-00"
                              className={`w-full bg-white/5 border ${userErrors.cpf ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-primary/50`} 
                            />
                            {userErrors.cpf && <span className="text-[9px] text-red-500 font-bold uppercase ml-4">{userErrors.cpf.message}</span>}
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-4">E-mail para recebimento</label>
                            <input 
                              {...registerUser("email")}
                              type="email" 
                              className={`w-full bg-white/5 border ${userErrors.email ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-primary/50`} 
                            />
                            {userErrors.email && <span className="text-[9px] text-red-500 font-bold uppercase ml-4">{userErrors.email.message}</span>}
                          </div>
                        </div>
                        <button type="submit" className="w-full py-5 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">
                          Próximo Passo
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="space-y-8"
                    >
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Pagamento</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: 'pix', name: 'PIX', icon: Smartphone, desc: 'Aprovação instantânea' },
                          { id: 'card', name: 'Cartão', icon: CreditCard, desc: 'Até 12x s/ juros' },
                          { id: 'apple', name: 'Apple Pay', icon: Landmark, desc: 'Rápido e seguro' }
                        ].map(method => (
                          <button 
                            key={method.id}
                            onClick={() => { setPaymentMethod(method.id as "pix" | "card" | "apple"); nextStep(); }}
                            className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all text-left group"
                          >
                            <method.icon className="w-6 h-6 text-stone-500 group-hover:text-primary mb-4 transition-colors" />
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">{method.name}</h3>
                            <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest">{method.desc}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="space-y-8"
                    >
                      {paymentMethod === 'pix' ? (
                        <div className="text-center space-y-8">
                          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Pague com PIX</h2>
                          <div className="mx-auto w-48 h-48 bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] relative">
                            <Image src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vibra-pix-payment" alt="QR Code PIX" fill className="p-4" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em]">Escaneie o código acima</p>
                            <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] underline">Copiar código PIX</button>
                          </div>
                          <button onClick={nextStep} className="w-full py-5 bg-primary text-white rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all">
                            Confirmar Pagamento
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Cartão de Crédito</h2>
                          <form onSubmit={handleSubmitCard(onSubmitCard)} className="space-y-8">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-4">Número do Cartão</label>
                                <input 
                                  {...registerCard("number")}
                                  type="text" 
                                  placeholder="0000 0000 0000 0000"
                                  className={`w-full bg-white/5 border ${cardErrors.number ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-primary/50`} 
                                />
                                {cardErrors.number && <span className="text-[9px] text-red-500 font-bold uppercase ml-4">{cardErrors.number.message}</span>}
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-4">Validade</label>
                                  <input 
                                    {...registerCard("expiry")}
                                    type="text" 
                                    placeholder="MM/AA"
                                    className={`w-full bg-white/5 border ${cardErrors.expiry ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-primary/50`} 
                                  />
                                  {cardErrors.expiry && <span className="text-[9px] text-red-500 font-bold uppercase ml-4">{cardErrors.expiry.message}</span>}
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-4">CVV</label>
                                  <input 
                                    {...registerCard("cvv")}
                                    type="text" 
                                    placeholder="000"
                                    className={`w-full bg-white/5 border ${cardErrors.cvv ? "border-red-500/50" : "border-white/10"} rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-primary/50`} 
                                  />
                                  {cardErrors.cvv && <span className="text-[9px] text-red-500 font-bold uppercase ml-4">{cardErrors.cvv.message}</span>}
                                </div>
                              </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-primary text-white rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all">
                              Revisar Compra
                            </button>
                          </form>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="text-center space-y-10"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                        <ShieldCheck className="w-10 h-10" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Tudo Pronto!</h2>
                        <p className="text-stone-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">
                          Ao clicar em finalizar, sua compra será processada de forma segura.
                        </p>
                      </div>
                      <button 
                        onClick={onSuccess}
                        className="w-full py-6 bg-white text-black rounded-full font-black text-sm tracking-[0.3em] uppercase hover:bg-primary hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                      >
                        Finalizar Compra
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
