import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface SearchParams {
  query?: string;
  category?: string;
  date?: string;
  location?: string;
}

export function useEventSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['events', 'search', params],
    queryFn: async () => {
      const { query, category, date, location } = params;
      const response = await api.get('/events', {
        params: {
          search: query,
          category: (category === 'Todos' || category === 'Todas') ? undefined : category,
          date,
          location
        }
      });
      return response.data || [];
    },
    enabled: true,
  });
}
