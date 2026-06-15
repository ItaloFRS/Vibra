"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export const EntryReveal = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5s for the reveal animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1, 1.2],
                opacity: [0, 1, 1],
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <Image 
                  src="/Monograma-l.png"
                  alt="logo"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              
            </motion.div>
            
            {/* The "Opening" Circle effect */}
            <motion.div 
              initial={{ scale: 0 }}
              exit={{ 
                scale: 50,
                transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
              }}
              className="absolute w-10 h-10 bg-background-dark rounded-full pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          scale: loading ? 0.95 : 1 
        }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      >
        {!loading && children}
      </motion.div>
    </>
  );
};
