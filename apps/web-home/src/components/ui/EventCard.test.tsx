import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventCard } from './EventCard';
import { MOCK_EVENTOS } from '@/lib/mocks/eventos';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('EventCard Component', () => {
  const evento = MOCK_EVENTOS[0];

  it('renders event title initially', () => {
    render(<EventCard evento={evento} />);
    expect(screen.getByText(evento.title)).toBeInTheDocument();
  });

  it('shows expanded info on hover', async () => {
    render(<EventCard evento={evento} />);
    
    const card = screen.getByText(evento.title).closest('div');
    if (card) fireEvent.mouseEnter(card);
    
    // Expanded info should now be visible
    expect(screen.getByText(evento.description || '')).toBeInTheDocument();
    expect(screen.getByText(evento.category || '')).toBeInTheDocument();
    expect(screen.getByText('Ingressos')).toBeInTheDocument();
  });
});
