import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventRow } from './EventRow';
import { MOCK_EVENTOS } from '@/lib/mocks/eventos';

describe('EventRow Component', () => {
  const eventos = MOCK_EVENTOS.slice(0, 3);
  const title = "Test Row";

  it('renders the title and event cards', () => {
    render(<EventRow title={title} eventos={eventos} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    eventos.forEach(evento => {
      expect(screen.getByText(evento.title)).toBeInTheDocument();
    });
  });

  it('does not render if there are no events', () => {
    const { container } = render(<EventRow title={title} eventos={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
