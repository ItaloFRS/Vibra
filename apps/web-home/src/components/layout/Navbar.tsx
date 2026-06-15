"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "../sections/event-purchase/AuthModal";
import { User } from "lucide-react";

export const Navbar = () => {
  const scrolled = useScroll(100);
  const [isHovered, setIsHovered] = useState(false);
  const { isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal, login } = useAuth();

  // Determine if the navbar should be in "compact" mode
  const isCompact = scrolled && !isHovered;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Eventos", href: "/eventos" },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 flex-nowrap">
        <motion.header
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className={cn(
            "relative flex items-center transition-all duration-500 ease-[0.76, 0, 0.24, 1]",
            "bg-white/10 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl overflow-hidden",
            isCompact ? "px-4 py-2" : "px-6 py-2.5"
          )}
        >
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <Image src={isCompact ? "/Monograma-l.png" : "/Logo_Vibra.png"} alt="Vibra Logo" width={100} height={100} />
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-6">
              <AnimatePresence mode="popLayout">
                {navLinks.map((link, index) => {
                  // When compact, only show the first link (Home)
                  if (isCompact && index > 0) return null;

                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className="text-sm font-plus-bold text-white hover:text-primary-container transition-colors tracking-tight"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </nav>

            {/* Buttons / Auth State */}
            <AnimatePresence>
              {!isCompact && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex items-center gap-4 overflow-hidden flex-nowrap"
                >
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/eventos"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors px-2  hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] "
                      >
                        Meus Ingressos
                      </Link>
                      
                      <div className="w-px h-4 bg-white/20 mx-1" />

                      <button
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px] flex items-center justify-center hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all"
                        title="Perfil"
                      >
                        <div className="w-full h-full rounded-full bg-[#1C1917] flex items-center justify-center ">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={openAuthModal}
                        className="px-5 py-2 rounded-full bg-white text-black font-plus-ebold text-[10px] tracking-widest uppercase hover:bg-stone-200 transition-colors"
                      >
                        Login
                      </button>
                      
                      <Link
                        href="#"
                        className="px-5 py-2 rounded-full bg-primary text-white font-plus-ebold text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors flex-nowrap"
                      >
                        Baixar.App
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        onSuccess={() => {
          login();
          closeAuthModal();
        }}
      />
    </>
  );
};
