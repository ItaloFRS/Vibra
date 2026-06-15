import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '@/components/sections/event-purchase/CartDrawer';
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
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('CartDrawer', () => {
  const tickets = MOCK_TICKET_TYPES['e1'];
  const cart = {
    [tickets[0].id]: 2, // 2x Pista (80 * 2 = 160)
  };

  it('deve renderizar os itens do carrinho', () => {
    render(
      <CartDrawer 
        isOpen={true} 
        onClose={() => {}} 
        tickets={tickets} 
        cart={cart} 
        onUpdateQuantity={() => {}} 
        onCheckout={() => {}} 
      />
    );
    
    expect(screen.getByText(tickets[0].name)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('deve calcular corretamente subtotal, taxa e total', () => {
    render(
      <CartDrawer 
        isOpen={true} 
        onClose={() => {}} 
        tickets={tickets} 
        cart={cart} 
        onUpdateQuantity={() => {}} 
        onCheckout={() => {}} 
      />
    );
    
    const subtotal = 160;
    const serviceFee = 16;
    const total = 176;

    expect(screen.getAllByText(`R$ ${subtotal.toFixed(2)}`)[0]).toBeInTheDocument();
    expect(screen.getByText(`R$ ${serviceFee.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`R$ ${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('deve chamar onUpdateQuantity ao clicar nos botões de ajuste', () => {
    const onUpdateQuantity = vi.fn();
    render(
      <CartDrawer 
        isOpen={true} 
        onClose={() => {}} 
        tickets={tickets} 
        cart={cart} 
        onUpdateQuantity={onUpdateQuantity} 
        onCheckout={() => {}} 
      />
    );
    
    const addButton = screen.getByLabelText(`Aumentar quantidade de ${tickets[0].name}`);
    fireEvent.click(addButton);
    expect(onUpdateQuantity).toHaveBeenCalledWith(tickets[0].id, 3);
  });

  it('deve chamar onCheckout ao clicar no botão de finalizar', () => {
    const onCheckout = vi.fn();
    render(
      <CartDrawer 
        isOpen={true} 
        onClose={() => {}} 
        tickets={tickets} 
        cart={cart} 
        onUpdateQuantity={() => {}} 
        onCheckout={onCheckout} 
      />
    );
    
    const checkoutButton = screen.getByLabelText('Finalizar compra');
    fireEvent.click(checkoutButton);
    expect(onCheckout).toHaveBeenCalled();
  });
});
