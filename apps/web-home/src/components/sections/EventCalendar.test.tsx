import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventCalendar } from './EventCalendar';
import { startOfToday, format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

describe('EventCalendar Component', () => {
  it('renders dates starting from today', () => {
    render(<EventCalendar selectedDate={null} onDateSelect={() => {}} />);
    
    const today = startOfToday();
    const todayDay = format(today, 'd');
    
    expect(screen.getAllByText(todayDay).length).toBeGreaterThan(0);
  });

  it('calls onDateSelect when a date is clicked', () => {
    const onDateSelect = vi.fn();
    render(<EventCalendar selectedDate={null} onDateSelect={onDateSelect} />);
    
    const tomorrow = addDays(startOfToday(), 1);
    const tomorrowDay = format(tomorrow, 'd');
    
    const dateButton = screen.getAllByText(tomorrowDay)[0].closest('button');
    if (dateButton) fireEvent.click(dateButton);
    
    expect(onDateSelect).toHaveBeenCalled();
  });

  it('highlights the selected date', () => {
    const today = startOfToday();
    render(<EventCalendar selectedDate={today} onDateSelect={() => {}} />);
    
    const todayDay = format(today, 'd');
    const dateButton = screen.getAllByText(todayDay)[0].closest('button');
    
    expect(dateButton).toHaveClass('bg-primary');
  });
});
