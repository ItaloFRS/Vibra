import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentModal } from '@/components/sections/event-purchase/PaymentModal';
import { MOCK_TICKET_TYPES } from '@/lib/mocks/tickets';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      div: ({ children, whileInView, initial, viewport, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, whileInView, initial, viewport, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock Image de Next.js
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('PaymentModal', () => {
  const tickets = MOCK_TICKET_TYPES['e1'];
  const cart = { [tickets[0].id]: 1 };

  it('deve renderizar o step 1 (Dados Pessoais) por padrão', () => {
    render(<PaymentModal isOpen={true} onClose={() => {}} onSuccess={() => {}} tickets={tickets} cart={cart} />);
    expect(screen.getByText(/Dados Pessoais/i)).toBeInTheDocument();
  });

  it('deve avançar para o step 2 ao preencher dados corretamente', async () => {
    render(<PaymentModal isOpen={true} onClose={() => {}} onSuccess={() => {}} tickets={tickets} cart={cart} />);
    
    // CPF é o único campo vazio por padrão no mock
    const cpfInput = screen.getByPlaceholderText(/000.000.000-00/i);
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    
    const nextButton = screen.getByText(/Próximo Passo/i);
    fireEvent.click(nextButton);
    
    expect(await screen.findByText(/Pagamento/i)).toBeInTheDocument();
  });

  it('deve permitir selecionar PIX e ver o QR Code', async () => {
    render(<PaymentModal isOpen={true} onClose={() => {}} onSuccess={() => {}} tickets={tickets} cart={cart} />);
    
    // Step 1 -> Step 2
    fireEvent.change(screen.getByPlaceholderText(/000.000.000-00/i), { target: { value: '123.456.789-00' } });
    fireEvent.click(screen.getByText(/Próximo Passo/i));
    
    // Step 2 -> Step 3 (PIX)
    const pixButton = await screen.findByText(/PIX/i);
    fireEvent.click(pixButton);
    
    expect(await screen.findByText(/Pague com PIX/i)).toBeInTheDocument();
    expect(screen.getByAltText(/QR Code PIX/i)).toBeInTheDocument();
  });
});
