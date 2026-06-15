"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CATEGORIAS } from "@/lib/mocks/eventos";
import { EventHero } from "@/components/sections/EventHero";
import { EventFilters } from "@/components/sections/EventFilters";
import { EventRow } from "@/components/sections/EventRow";
import { EventCardSkeleton } from "@/components/ui/EventCardSkeleton";
import { useEvents, useCategories } from "@/hooks/use-api-data";
import { Event } from "@/types/api";

export default function EventosPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCity, setSelectedCity] = useState("Campina Grande");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});

  const { data: events, isLoading, isError } = useEvents({
    search: searchQuery,
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    ...coords
  });

  const { data: categories } = useCategories();

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setSelectedCity("Localização Atual");
      }, (error) => {
        console.error("Erro ao detectar localização:", error);
      });
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [category] // O backend atual só filtra por uma categoria por vez no @RequestParam
    );
  };

  const filteredEventos = useMemo(() => {
    if (!events) return [];
    // Filtros adicionais client-side se necessário
    return events;
  }, [events]);

  const destaqueEventos = useMemo(() => {
    return events?.slice(0, 3) || [];
  }, [events]);

  const clearAllFilters = () => {
    setSelectedDate(null);
    setSelectedCategories([]);
    setPriceRange([0, 2000]);
    setSearchQuery("");
    setCoords({});
    setSelectedCity("Campina Grande");
  };

  return (
    
      <main className="relative min-h-screen bg-black text-white selection:bg-primary selection:text-white overflow-x-hidden">
        <Navbar />
        
        {destaqueEventos.length > 0 && <EventHero eventos={destaqueEventos} />}
        
        <div className="max-w-[1600px] mx-auto pl-6 pr-6 lg:pr-0 flex flex-col lg:flex-row gap-12 py-12 relative">
          {/* Mobile Filter Trigger */}
          <button 
            onClick={() => setIsFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-plus-bold uppercase tracking-widest sticky top-24 z-20 backdrop-blur-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filtros & Calendário
          </button>

          <EventFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            selectedCategories={selectedCategories}
            onCategoryChange={toggleCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            onLocationDetect={handleLocationDetection}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            allEvents={events || []}
            onClearAll={clearAllFilters}
            categories={categories || []}
          />

          <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-visible lg:-mr-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-10">
                  <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg mb-6 ml-2" />
                  <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <EventCardSkeleton key={j} />
                    ))}
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="w-full py-40 flex flex-col items-center justify-center text-stone-600">
                <p className="text-sm font-plus-bold uppercase tracking-[0.2em]">Ocorreu um erro ao carregar os eventos</p>
              </div>
            ) : (
              <>
                <EventRow 
                  title="Destaques" 
                  eventos={destaqueEventos} 
                />
                
                {(categories || []).map(cat => {
                  const catEvents = filteredEventos.filter(e => e.category === cat);
                  if (catEvents.length === 0) return null;
                  
                  return (
                    <EventRow 
                      key={cat} 
                      title={cat} 
                      eventos={catEvents} 
                    />
                  );
                })}

                {filteredEventos.length === 0 && (
                  <div className="w-full py-40 flex flex-col items-center justify-center text-stone-600">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 opacity-20">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-sm font-plus-bold uppercase tracking-[0.2em]">Nenhum evento encontrado</p>
                    <button 
                      onClick={clearAllFilters}
                      className="mt-6 text-[10px] font-plus-bold text-primary uppercase tracking-widest hover:underline"
                    >
                      Limpar todos os filtros
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <footer className="py-20 border-t border-white/5 text-center text-[10px] tracking-widest text-stone-600 uppercase">
          © 2026 VIBRA. TODOS OS DIREITOS RESERVADOS.
        </footer>
      </main>

  );
}
