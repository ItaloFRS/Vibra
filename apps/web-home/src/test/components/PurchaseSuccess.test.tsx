import { render, screen, fireEvent } from '@testing-library/react';
import { PurchaseSuccess } from '@/components/sections/event-purchase/PurchaseSuccess';
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

// Mock Image de Next.js
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('PurchaseSuccess', () => {
  it('deve renderizar a mensagem de sucesso', () => {
    render(<PurchaseSuccess onClose={() => {}} />);
    expect(screen.getByText(/Sua/i)).toBeInTheDocument();
    expect(screen.getByText(/Vibração/i)).toBeInTheDocument();
    expect(screen.getByText(/Está Garantida!/i)).toBeInTheDocument();
  });

  it('deve renderizar o preview do ingresso', () => {
    render(<PurchaseSuccess onClose={() => {}} />);
    expect(screen.getByText(/Ingresso Confirmado/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Ticket QR/i)).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão de ver ingressos', () => {
    const onClose = vi.fn();
    render(<PurchaseSuccess onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /Ver Meus Ingressos/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
