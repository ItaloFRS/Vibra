import api from './api';

export interface ProfileUpdateRequest {
  fullName?: string;
  bio?: string;
  profilePhotoUrl?: string;
  preferences?: Record<string, any>;
}

export const profileService = {
  async updateProfile(data: ProfileUpdateRequest) {
    const response = await api.patch('/auth/profile', data);
    return response.data.data; // Desempacota o objeto do usuário
  }
};
