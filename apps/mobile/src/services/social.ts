import api from './api';

export const socialService = {
  async getMatchCount(): Promise<number> {
    const response = await api.get<number>('/social/matches/count');
    return response.data;
  }
};
