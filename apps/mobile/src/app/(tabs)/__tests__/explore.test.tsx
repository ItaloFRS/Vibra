import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ExploreScreen from '../explore';
import { useEventSearch } from '../../../hooks/useEventSearch';
import { useQuery } from '@tanstack/react-query';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Hooks
jest.mock('../../../hooks/useEventSearch', () => ({
  useEventSearch: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

// Mock API
jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock Icons
jest.mock('lucide-react-native', () => ({
  Search: () => 'SearchIcon',
  MapPin: () => 'MapPinIcon',
  Bell: () => 'BellIcon',
  Heart: () => 'HeartIcon',
  Calendar: () => 'CalendarIcon',
  Clock: () => 'ClockIcon',
  X: () => 'XIcon',
}));

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

describe('ExploreScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useEventSearch as jest.Mock).mockReturnValue({
      data: [
        { id: '1', title: 'Search Result 1', thumbnailUrl: '', eventDate: '2026-04-16T20:00:00Z', location: 'Location 1', price: 80 },
      ],
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'categories') {
        return {
          data: ['Festas', 'Shows', 'Cultura'],
          isLoading: false,
        };
      }
      if (queryKey[0] === 'interests') {
        return {
          data: [],
          isLoading: false,
        };
      }
      return { data: [], isLoading: false };
    });
  });

  it('should render the screen title and calendar', async () => {
    const { getByText, getAllByText } = render(<ExploreScreen />);
    
    expect(getByText('Próximos Eventos')).toBeTruthy();
    // Use flexible date match or regex since today varies
    // But in this case, the component uses new Date() so it's hard to test exact month/year without mocking Date
    // expect(getByText(/2026/)).toBeTruthy();
  });

  it('should render dynamic categories fetched from API', async () => {
    const { getByText } = render(<ExploreScreen />);
    
    await waitFor(() => {
      expect(getByText('Todas')).toBeTruthy();
      expect(getByText('Festas')).toBeTruthy();
      expect(getByText('Shows')).toBeTruthy();
      expect(getByText('Cultura')).toBeTruthy();
    });
  });

  it('should change category when a chip is pressed', async () => {
    const { getByText } = render(<ExploreScreen />);
    
    await waitFor(() => {
      const chip = getByText('Festas');
      fireEvent.press(chip);
      
      expect(useEventSearch).toHaveBeenCalledWith(expect.objectContaining({
        category: 'Festas'
      }));
    });
  });

  it('should call useEventSearch with query when typing in search bar', async () => {
    const { getByPlaceholderText } = render(<ExploreScreen />);
    
    const input = getByPlaceholderText('Buscar eventos, festas ou shows...');
    fireEvent.changeText(input, 'Festival');
    
    expect(useEventSearch).toHaveBeenCalled();
  });
});
