import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from '@/components/sections/event-purchase/AuthModal';
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

// Mock Image de Next.js
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('AuthModal', () => {
  it('deve renderizar o formulário de login por padrão', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={() => {}} />);
    expect(screen.getByText(/Bem-vindo de Volta/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Senha/i)).toBeInTheDocument();
  });

  it('deve alternar para o modo de cadastro ao clicar no link', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={() => {}} />);
    
    const toggleButton = screen.getByText(/Ainda não tem conta\? Cadastre-se/i);
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(/Crie sua Conta/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nome Completo/i)).toBeInTheDocument();
  });

  it('deve exibir erros de validação para campos vazios no login', async () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/E-mail inválido/i)).toBeInTheDocument();
    expect(await screen.findByText(/Senha muito curta/i)).toBeInTheDocument();
  });
});
