import { render, screen, fireEvent } from '@testing-library/react';
import { TicketCard } from '@/components/sections/event-purchase/TicketCard';
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

describe('TicketCard', () => {
  const ticket = MOCK_TICKET_TYPES['e1'][0];

  it('deve renderizar o nome e valor do ingresso', () => {
    render(<TicketCard ticket={ticket} quantity={0} onAdd={() => {}} onRemove={() => {}} />);
    expect(screen.getByText(ticket.name)).toBeInTheDocument();
    expect(screen.getByText(ticket.price.toString())).toBeInTheDocument();
  });

  it('deve chamar onAdd ao clicar no botão de adicionar', () => {
    const onAdd = vi.fn();
    render(<TicketCard ticket={ticket} quantity={0} onAdd={onAdd} onRemove={() => {}} />);
    
    const addButton = screen.getByLabelText('Adicionar ingresso');
    fireEvent.click(addButton);
    
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onRemove ao clicar no botão de remover quando quantidade > 0', () => {
    const onRemove = vi.fn();
    render(<TicketCard ticket={ticket} quantity={1} onAdd={() => {}} onRemove={onRemove} />);
    
    const removeButton = screen.getByLabelText('Remover ingresso');
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar o botão de remover quando quantidade é 0', () => {
    render(<TicketCard ticket={ticket} quantity={0} onAdd={() => {}} onRemove={() => {}} />);
    
    const removeButton = screen.getByLabelText('Remover ingresso');
    expect(removeButton).toBeDisabled();
  });

  it('deve exibir a quantidade correta', () => {
    render(<TicketCard ticket={ticket} quantity={5} onAdd={() => {}} onRemove={() => {}} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
