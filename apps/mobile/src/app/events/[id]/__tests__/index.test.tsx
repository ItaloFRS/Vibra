import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EventHubScreen from '../index';
import { useQuery } from '@tanstack/react-query';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: () => ({
    mutate: jest.fn(),
  }),
}));

// Mock API
jest.mock('../../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock Icons
jest.mock('lucide-react-native', () => ({
  ArrowLeft: () => 'ArrowLeftIcon',
  Share2: () => 'Share2Icon',
  MapPin: () => 'MapPinIcon',
  Check: () => 'CheckIcon',
  Minus: () => 'MinusIcon',
  Plus: () => 'PlusIcon',
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock Components
jest.mock('../../../../components/MatchTab', () => 'MatchTab');
jest.mock('../../../../components/CommunityTab', () => 'CommunityTab');
jest.mock('../../../../components/VipTab', () => 'VipTab');

describe('EventHubScreen Truncation', () => {
  const longDescription = 'This is a very long description that should definitely exceed four lines of text in a mobile screen. '.repeat(10);

  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'event') {
        return {
          data: {
            id: '1',
            title: 'Test Event',
            description: longDescription,
            eventDate: '2026-04-16T20:00:00Z',
            location: 'Test Location',
            thumbnailUrl: '',
          },
          isLoading: false,
        };
      }
      return { data: null, isLoading: false };
    });
  });

  it('should show "Ver mais" button when description is long', async () => {
    const { getByTestId, getByText } = render(<EventHubScreen />);
    
    await waitFor(() => {
      const text = getByTestId('event-description-measure');
      fireEvent(text, 'textLayout', {
        nativeEvent: { lines: new Array(5).fill({}) }
      });
    });

    await waitFor(() => {
      expect(getByText('Ver mais')).toBeTruthy();
    });
  });

  it('should toggle text expansion when "Ver mais" is pressed', async () => {
    const { getByTestId, getByText } = render(<EventHubScreen />);
    
    await waitFor(() => {
      const text = getByTestId('event-description-measure');
      fireEvent(text, 'textLayout', {
        nativeEvent: { lines: new Array(5).fill({}) }
      });
    });

    await waitFor(() => {
      const button = getByText('Ver mais');
      fireEvent.press(button);
      expect(getByText('Ver menos')).toBeTruthy();
    });
  });
});
