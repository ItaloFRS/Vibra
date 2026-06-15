import { render, screen } from '@testing-library/react';
import { EventPurchaseHero } from '@/components/sections/event-purchase/EventPurchaseHero';
import { MOCK_EVENTOS } from '@/lib/mocks/eventos';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock do framer-motion para evitar problemas com animações nos testes
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      div: ({ children, whileInView, initial, viewport, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, whileInView, initial, viewport, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
      h1: ({ children, whileInView, initial, viewport, ...props }: any) => <h1 {...props}>{children}</h1>,
      span: ({ children, whileInView, initial, viewport, ...props }: any) => <span {...props}>{children}</span>,
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('EventPurchaseHero', () => {
  const evento = MOCK_EVENTOS[0];

  it('deve renderizar o título do evento', () => {
    render(<EventPurchaseHero evento={evento} />);
    expect(screen.getByText(evento.title)).toBeInTheDocument();
  });

  it('deve renderizar a categoria do evento', () => {
    render(<EventPurchaseHero evento={evento} />);
    expect(screen.getByText(evento.category || '')).toBeInTheDocument();
  });

  it('deve renderizar o local do evento', () => {
    render(<EventPurchaseHero evento={evento} />);
    expect(screen.getByText(new RegExp(evento.location || '', 'i'))).toBeInTheDocument();
  });

  it('deve renderizar o preço mínimo', () => {
    render(<EventPurchaseHero evento={evento} />);
    expect(screen.getByText((evento.minPrice || 0).toString())).toBeInTheDocument();
  });
});
