import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventosPage from '@/app/eventos/page';
import { useEvents, useCategories } from '@/hooks/use-api-data';
import React from 'react';

// Mock dos hooks
vi.mock('@/hooks/use-api-data', () => ({
  useEvents: vi.fn(),
  useCategories: vi.fn(),
}));

// Mock do Navbar e outros componentes pesados
vi.mock('@/components/layout/Navbar', () => ({
  Navbar: () => <div data-testid="navbar" />,
}));

vi.mock('@/components/sections/EventHero', () => ({
  EventHero: () => <div data-testid="event-hero" />,
}));

describe('EventosPage Filters Integration', () => {
  const mockEvents = [
    { id: '1', title: 'Rock in CG', category: 'Show', eventDate: '2026-05-20T20:00:00Z', location: 'Arena' },
    { id: '2', title: 'Festa do Branco', category: 'Festa Noturna', eventDate: '2026-05-21T22:00:00Z', location: 'Clube' },
  ];

  const mockCategories = ['Show', 'Festa Noturna', 'Teatro'];

  beforeEach(() => {
    (useCategories as any).mockReturnValue({ data: mockCategories });
    (useEvents as any).mockReturnValue({ data: mockEvents, isLoading: false, isError: false });
  });

  it('deve chamar useEvents com a nova busca ao digitar no campo de pesquisa', async () => {
    render(<EventosPage />);
    
    const searchInput = screen.getByPlaceholderText(/Nome do evento/i);
    fireEvent.change(searchInput, { target: { value: 'Rock' } });

    await waitFor(() => {
      expect(useEvents).toHaveBeenCalledWith(expect.objectContaining({
        search: 'Rock'
      }));
    });
  });

  it('deve chamar useEvents com a categoria correta ao clicar em um filtro de categoria', async () => {
    render(<EventosPage />);
    
    // Buscar especificamente o span dentro do botão de categoria
    const categoryButton = screen.getAllByText('Show').find(el => el.tagName === 'SPAN');
    if (categoryButton) fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(useEvents).toHaveBeenCalledWith(expect.objectContaining({
        category: 'Show'
      }));
    });
  });

  it('deve limpar todos os filtros ao clicar no botão Limpar', async () => {
    render(<EventosPage />);
    
    // Aplicar um filtro primeiro
    const searchInput = screen.getByPlaceholderText(/Nome do evento/i);
    fireEvent.change(searchInput, { target: { value: 'Festa' } });
    
    const clearButton = screen.getByText(/Limpar Filtros/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(useEvents).toHaveBeenLastCalledWith(expect.objectContaining({
        search: '',
        category: undefined
      }));
    });
  });
});
