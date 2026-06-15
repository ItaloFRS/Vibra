import { render, screen } from '@testing-library/react';
import { expect, test, vi, Mock } from 'vitest';
import { EventCarousel } from '@/components/sections/EventCarousel';
import { useEvents } from '@/hooks/use-api-data';

// Mock do hook useEvents
vi.mock('@/hooks/use-api-data', () => ({
  useEvents: vi.fn(),
}));

test('renderiza skeletons durante o carregamento', () => {
  (useEvents as Mock).mockReturnValue({
    isLoading: true,
    data: null,
  });

  render(<EventCarousel />);
  
  // Verifica se existem skeletons
  const skeletons = screen.getAllByTestId('skeleton');
  expect(skeletons.length).toBeGreaterThan(0);
});

test('renderiza mensagem de erro em caso de falha na API', () => {
  (useEvents as Mock).mockReturnValue({
    isLoading: false,
    isError: true,
    data: null,
  });

  render(<EventCarousel />);
  
  expect(screen.getByText(/Não foi possível carregar os eventos/i)).toBeDefined();
});

test('renderiza os eventos retornados pela API', () => {
  const mockEvents = [
    { id: '1', title: 'Evento 1', thumbnailUrl: '/img1.jpg', slug: 'evento-1', eventDate: '2026-05-13T00:00:00Z', ticketTypes: [], lineup: [] },
    { id: '2', title: 'Evento 2', thumbnailUrl: '/img2.jpg', slug: 'evento-2', eventDate: '2026-05-14T00:00:00Z', ticketTypes: [], lineup: [] },
  ];

  (useEvents as Mock).mockReturnValue({
    isLoading: false,
    isError: false,
    data: mockEvents,
  });

  render(<EventCarousel />);
  
  expect(screen.getAllByText('Evento 1').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Evento 2').length).toBeGreaterThan(0);
});
