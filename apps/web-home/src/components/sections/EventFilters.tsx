"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIAS } from "@/lib/mocks/eventos";
import { EventCalendar } from "./EventCalendar";
import { Event } from "@/types/api";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onLocationDetect?: () => void;
  isOpen: boolean;
  onClose: () => void;
  allEvents: Event[];
  onClearAll: () => void;
  categories: string[];
}

export const EventFilters = ({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateSelect,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedCity,
  onCityChange,
  onLocationDetect,
  isOpen,
  onClose,
  allEvents,
  onClearAll,
  categories,
}: EventFiltersProps) => {
  return (
    <>
    {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

    {/* Filter Sidebar / Drawer */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? '-100%' : 0),
          opacity: 1
        }}
        className={`
          fixed lg:sticky top-0 lg:top-28 left-0 h-full lg:h-fit w-[300px] lg:w-[25%] lg:flex-shrink-0 bg-black/60 lg:bg-white/[003] backdrop-blur-xl z-[101] lg:z-40 border-r lg:border border-white/10 p-8 lg:p-6 lg:rounded-3xl overflow-y-auto lg:overflow-visible no-scrollbar transition-all
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-plus-ebold text-white lg:text-sm lg:uppercase lg:tracking-[0.2em] lg:text-stone-500">Filtros</h2>
          <div className="flex items-center gap-4">
             <button 
              onClick={onClearAll}
              className="text-[10px] font-plus-bold text-primary uppercase tracking-widest hover:underline whitespace-nowrap"
            >
              Limpar Filtros
            </button>
            <button onClick={onClose} className="text-stone-500 lg:hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      {/* Location Selection */}
        <div className="mb-10">
          <h3 className="text-[10px] font-plus-bold text-stone-500 uppercase tracking-[0.3em] mb-4">Localização</h3>
          <div className="relative">
            <select 
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="Campina Grande" className="bg-stone-900">Campina Grande, PB</option>
              <option value="João Pessoa" className="bg-stone-900">João Pessoa, PB</option>
              <option value="Recife" className="bg-stone-900">Recife, PE</option>
              <option value="São Paulo" className="bg-stone-900">São Paulo, SP</option>
              <option value="Localização Atual" className="bg-stone-900">Localização Atual</option>
            </select>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button 
            onClick={onLocationDetect}
            className="mt-3 flex items-center gap-2 text-[10px] font-plus-bold text-stone-400 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Usar minha localização
          </button>
        </div>

      {/* Search Input */}
        <div className="mb-10">
          <h3 className="text-[10px] font-plus-bold text-stone-500 uppercase tracking-[0.3em] mb-4">Pesquisar</h3>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Nome do evento..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-stone-600"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-primary transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

      {/* Calendar */}
        <EventCalendar 
          selectedDate={selectedDate} 
          onDateSelect={onDateSelect} 
          events={allEvents}
        />

      {/* Categories */}
          <div className="mb-12">
            <h3 className="text-[10px] font-plus-bold text-stone-500 uppercase tracking-[0.3em] mb-6">
              Categorias
            </h3>
  
      {/* Mudança principal aqui: grid e grid-cols-2 */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className="flex items-center group transition-all"
                >
                  <div className={`
                    w-4 h-4 rounded-md border mr-3 flex items-center justify-center transition-all
                    ${isSelected ? 'bg-primary border-orange-500' : 'border-white/20 group-hover:border-white/40'}
                  `}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 5L4 7L8 3" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-all ${isSelected ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      {/* Price Range */}
        <div className="mb-12">
          <h3 className="text-[10px] font-plus-bold text-stone-500 uppercase tracking-[0.3em] mb-6">Faixa de Preço</h3>
          <div className="space-y-6">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              value={priceRange[1]}
              onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] font-plus-bold text-stone-500 uppercase">
              <span>Grátis</span>
              <span className="text-white">Até R$ {priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Apply Button for Mobile */}
        <button 
          onClick={onClose}
          className="w-full mt-12 py-4 bg-primary text-white rounded-xl font-plus-bold text-xs uppercase tracking-widest lg:hidden"
        >
          Aplicar Filtros
        </button>
      </motion.aside>
    </>
  );
};
