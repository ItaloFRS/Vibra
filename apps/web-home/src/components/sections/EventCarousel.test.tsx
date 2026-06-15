import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventCarousel } from './EventCarousel';
import { useEvents } from '@/hooks/use-api-data';
import React from 'react';

// Mock do hook useEvents
vi.mock('@/hooks/use-api-data', () => ({
  useEvents: vi.fn(),
}));

// Mock do next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock do framer-motion
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      div: ({ children, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe('EventCarousel Component', () => {
  it('renders skeletons during loading state', () => {
    (useEvents as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<EventCarousel />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message during error state', () => {
    (useEvents as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<EventCarousel />);
    expect(screen.getByText(/Não foi possível carregar os eventos/i)).toBeInTheDocument();
  });

  it('renders events correctly after loading', () => {
    const mockEvents = [
      { id: '1', title: 'Evento 1', thumbnailUrl: '/img1.jpg', slug: 'evento-1' },
      { id: '2', title: 'Evento 2', thumbnailUrl: '/img2.jpg', slug: 'evento-2' },
    ];

    (useEvents as any).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      isError: false,
    });

    render(<EventCarousel />);
    expect(screen.getAllByText('Evento 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Evento 2').length).toBeGreaterThanOrEqual(1);
  });
});
