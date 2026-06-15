import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index';
import { useQuery } from '@tanstack/react-query';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock React Query
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
  Calendar: () => 'CalendarIcon',
  Heart: () => 'HeartIcon',
}));

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

// Mock Hooks
jest.mock('../../../hooks/useUserLocation', () => ({
  useUserLocation: () => ({
    locationName: 'Campina Grande - PB',
    loading: false,
    errorMsg: null,
  }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'events') {
        return {
          data: [
            { id: '1', title: 'Featured Event', thumbnailUrl: '', eventDate: '2026-05-14T20:00:00Z', location: 'Location 1' },
            { id: '2', title: 'Upcoming Event 1', thumbnailUrl: '', eventDate: '2026-05-15T20:00:00Z', location: 'Location 2' },
          ],
          isLoading: false,
          refetch: jest.fn(),
          isRefetching: false,
        };
      }
      return { data: [], isLoading: false, refetch: jest.fn() };
    });
  });

  it('should not render "Próximos Eventos" section title', async () => {
    const { queryByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(queryByText('Próximos Eventos')).toBeNull();
    });
  });

  it('should render "Destaque do Dia"', async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText('Destaque do Dia')).toBeTruthy();
      expect(getByText('Featured Event')).toBeTruthy();
    });
  });
});
