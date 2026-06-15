import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventHero } from './EventHero';
import { MOCK_EVENTOS } from '@/lib/mocks/eventos';

// Mock framer-motion hooks
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useScroll: vi.fn(() => ({ scrollYProgress: { get: () => 0 } })),
    useTransform: vi.fn(() => 0),
  };
});

describe('EventHero Component', () => {
  const destaqueEventos = MOCK_EVENTOS.filter(e => e.destaque);

  it('renders the current event information', () => {
    render(<EventHero eventos={destaqueEventos} />);
    
    // Check if the first event's name is rendered (split into spans)
    const firstNameWords = destaqueEventos[0].title.split(' ');
    firstNameWords.forEach(word => {
      expect(screen.getAllByText(word)[0]).toBeInTheDocument();
    });

    expect(screen.getByText(destaqueEventos[0].category || '')).toBeInTheDocument();
    expect(screen.getByText(destaqueEventos[0].description || '')).toBeInTheDocument();
    expect(screen.getByText('Comprar Ingresso')).toBeInTheDocument();
  });

  it('renders price correctly', () => {
    render(<EventHero eventos={destaqueEventos} />);
    expect(screen.getByText(`R$ ${destaqueEventos[0].minPrice}`)).toBeInTheDocument();
  });
});
