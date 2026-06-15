import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MatchTab from '../MatchTab';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// Mock dependencies
jest.mock('../../context/AuthContext');
jest.mock('../../context/ThemeContext', () => ({
  ThemeProvider: ({ children }: any) => children,
  useTheme: () => ({ colorScheme: 'light' })
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() })
}));
jest.mock('../../services/api');
jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
    useMutation: () => ({ mutate: jest.fn(), isPending: false }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('MatchTab', () => {
  const mockEventId = 'event-123';
  const mockEventName = 'Test Event';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupMocks = (userPrefs: any, interest: any = { favorite: true, hasTicket: false }) => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        preferences: userPrefs
      }
    });

    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'interest') {
        return { data: interest, isLoading: false };
      }
      if (queryKey[0] === 'potentials') {
        return { data: [], isLoading: false };
      }
      return { data: null, isLoading: false };
    });
  };

  it('should render "Perfil Incompleto" when wantsMatches is false', async () => {
    setupMocks({
      wantsMatches: false,
      matchGender: 'Mulher',
      matchAgeMin: 18,
      matchAgeMax: 30,
      gender: 'Homem',
      age: 25,
      vibes: ['Techno']
    });

    const { getByText } = render(<MatchTab eventId={mockEventId} eventName={mockEventName} />, { wrapper });

    await waitFor(() => {
      expect(getByText('Perfil Incompleto')).toBeTruthy();
    });
  });

  it('should render API error message when backend returns profile incomplete', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        preferences: { wantsMatches: true } 
      }
    });

    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'interest') {
        return { data: { favorite: true }, isLoading: false };
      }
      if (queryKey[0] === 'potentials') {
        return { 
          data: null, 
          isLoading: false, 
          error: { response: { data: { message: 'Perfil incompleto: falta preencher idade e gênero.' } } } 
        };
      }
      return { data: null, isLoading: false };
    });

    const { getByText } = render(<MatchTab eventId={mockEventId} eventName={mockEventName} />, { wrapper });

    await waitFor(() => {
      expect(getByText('Perfil Incompleto')).toBeTruthy();
      expect(getByText('Perfil incompleto: falta preencher idade e gênero.')).toBeTruthy();
    });
  });

  it('should not render "Perfil Incompleto" when profile is complete and API succeeds', async () => {
    setupMocks({
      wantsMatches: true,
      matchGender: 'Mulher',
      matchAgeMin: 18,
      matchAgeMax: 30,
      gender: 'Homem',
      age: 25,
      vibes: ['Techno']
    });

    const { queryByText } = render(<MatchTab eventId={mockEventId} eventName={mockEventName} />, { wrapper });

    await waitFor(() => {
      expect(queryByText('Perfil Incompleto')).toBeNull();
    });
  });
});
