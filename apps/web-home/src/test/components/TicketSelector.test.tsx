import { render, screen } from '@testing-library/react';
import { TicketSelector } from '@/components/sections/event-purchase/TicketSelector';
import { MOCK_TICKET_TYPES } from '@/lib/mocks/tickets';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      div: ({ children, whileInView, initial, viewport, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe('TicketSelector', () => {
  const tickets = MOCK_TICKET_TYPES['e1'];

  it('deve renderizar todos os ingressos fornecidos', () => {
    render(<TicketSelector tickets={tickets} cart={{}} onUpdateQuantity={() => {}} />);
    
    tickets.forEach(ticket => {
      // Usar getAllByText e verificar se pelo menos um elemento (o h3) está presente
      expect(screen.getAllByText(ticket.name).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('deve exibir o título da seção', () => {
    render(<TicketSelector tickets={tickets} cart={{}} onUpdateQuantity={() => {}} />);
    expect(screen.getByText(/Escolha sua/i)).toBeInTheDocument();
    expect(screen.getByText(/Experiência/i)).toBeInTheDocument();
  });
});
