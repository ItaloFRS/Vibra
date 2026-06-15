import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Event, TicketSummary, ApiResponse } from '@/types/api';

export const useEvents = (params?: { category?: string; search?: string; lat?: number; lng?: number }) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Event[]>>('/v1/events', { params });
      return data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<string[]>>('/v1/events/categories');
      return data.data;
    },
  });
};

export const useEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      // O backend atualmente usa ID, mas planejamos suporte a slug. 
      // Por enquanto, se o slug for um UUID válido, buscamos por ID.
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      const url = isUuid ? `/v1/events/${slug}` : `/v1/events/slug/${slug}`;
      const { data } = await api.get<ApiResponse<Event>>(url);
      return data.data;
    },
    enabled: !!slug,
  });
};

export const useUserTickets = () => {
  return useQuery({
    queryKey: ['user-tickets'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TicketSummary[]>>('/v1/tickets/my-tickets');
      return data.data;
    },
  });
};
