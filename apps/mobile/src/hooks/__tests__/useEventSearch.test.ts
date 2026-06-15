import { renderHook, waitFor } from '@testing-library/react-native';
import { useEventSearch } from '../useEventSearch';
import { useQuery } from '@tanstack/react-query';

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useEventSearch', () => {
  it('should call useQuery with correct queryKey including search and filters', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { result } = renderHook(() => 
      useEventSearch({ query: 'Vibra', category: 'Festas' })
    );

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['events', 'search', { query: 'Vibra', category: 'Festas' }],
    }));
  });
});
