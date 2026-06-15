import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@VibraAdmin:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  getSummary: async () => {
    const response = await api.get('/admin/dashboard/summary');
    return response.data;
  },
  getEventStats: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}/stats`);
    return response.data;
  }
};

export const analyticsService = {
  getDemographics: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}/analytics/demographics`);
    return response.data;
  },
  getInteractions: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}/analytics/interactions`);
    return response.data;
  },
  getConversions: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}/analytics/conversions`);
    return response.data;
  }
};

export default api;
