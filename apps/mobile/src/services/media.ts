import api from './api';
import * as ImagePicker from 'expo-image-picker';

export interface UploadResponse {
  url: string;
}

export const mediaService = {
  async uploadImage(uri: string): Promise<UploadResponse> {
    const formData = new FormData();
    
    // Extract file name and extension
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const fileName = uri.split('/').pop();

    formData.append('file', {
      uri: uri,
      name: fileName || `image.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    const response = await api.post<UploadResponse>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async pickImage(): Promise<ImagePicker.ImagePickerAsset | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Precisamos de permissão para acessar suas fotos!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0];
    }

    return null;
  }
};
