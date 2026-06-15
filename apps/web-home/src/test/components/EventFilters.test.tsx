import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, Mock, describe } from 'vitest';
import { EventFilters } from '@/components/sections/EventFilters';

describe('EventFilters Component', () => {
  const mockProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    selectedDate: null,
    onDateSelect: vi.fn(),
    selectedCategories: [],
    onCategoryChange: vi.fn(),
    priceRange: [0, 2000] as [number, number],
    onPriceChange: vi.fn(),
    selectedCity: 'Campina Grande',
    onCityChange: vi.fn(),
    onLocationDetect: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
    allEvents: [],
    onClearAll: vi.fn(),
    categories: ['Festa', 'Show'],
  };

  test('renderiza as categorias dinâmicas do backend', () => {
    render(<EventFilters {...mockProps} />);
    expect(screen.getByText('Festa')).toBeDefined();
    expect(screen.getByText('Show')).toBeDefined();
  });

  test('chama onSearchChange ao digitar na busca', () => {
    render(<EventFilters {...mockProps} />);
    const input = screen.getByPlaceholderText(/Nome do evento/i);
    fireEvent.change(input, { target: { value: 'Rock' } });
    expect(mockProps.onSearchChange).toHaveBeenCalledWith('Rock');
  });

  test('chama onCategoryChange ao clicar em uma categoria', () => {
    render(<EventFilters {...mockProps} />);
    const categoryButton = screen.getByText('Festa');
    fireEvent.click(categoryButton);
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('Festa');
  });

  test('chama onLocationDetect ao clicar em usar localização', () => {
    render(<EventFilters {...mockProps} />);
    const locationButton = screen.getByText(/Usar minha localização/i);
    fireEvent.click(locationButton);
    expect(mockProps.onLocationDetect).toHaveBeenCalled();
  });

  test('chama onClearAll ao clicar em limpar filtros', () => {
    render(<EventFilters {...mockProps} />);
    const clearButton = screen.getByText(/Limpar Filtros/i);
    fireEvent.click(clearButton);
    expect(mockProps.onClearAll).toHaveBeenCalled();
  });
});
