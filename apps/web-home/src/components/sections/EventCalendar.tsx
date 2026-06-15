"use client";

import React, { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from "@/types/api";

interface EventCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  events?: Event[];
}

export const EventCalendar = ({ selectedDate, onDateSelect, events = [] }: EventCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Check if a day has events
  const hasEventsOnDay = (day: Date) => {
    return events.some(event => isSameDay(new Date(event.eventDate), day));
  };

  return (
    <div className="mb-12">
      <h3 className="text-[10px] font-plus-bold text-stone-500 uppercase tracking-[0.3em] mb-6">
        Calendário
      </h3>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <span className="text-sm font-plus-bold text-white capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>

          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-[9px] font-plus-bold text-stone-600 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const hasEvents = hasEventsOnDay(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(isSelected ? null : day)}
                className={`
                  relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-plus-medium transition-all
                  ${!isCurrentMonth ? 'text-stone-800' : 'text-stone-400'}
                  ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105' : 'hover:bg-white/5'}
                  ${hasEvents && !isSelected ? 'text-orange-500 font-plus-bold' : ''}
                  ${isToday && !isSelected && !hasEvents ? 'text-white font-plus-bold underline underline-offset-4 decoration-primary' : ''}
                `}
              >
                <span className={hasEvents && !isSelected ? "drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : ""}>
                  {format(day, "d")}
                </span>
                
                {hasEvents && (
                  <div className={`
                    absolute bottom-1.5 w-1 h-1 rounded-full 
                    ${isSelected ? 'bg-white' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]'}
                  `} />
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <button 
            onClick={() => onDateSelect(null)}
            className="w-full mt-4 py-2 text-[9px] font-plus-bold text-orange-500 uppercase tracking-widest hover:text-white transition-all drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] border border-orange-500/20 rounded-lg bg-orange-500/5 hover:bg-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          >
            Limpar Data
          </button>
        )}
      </div>
    </div>
  );
};
