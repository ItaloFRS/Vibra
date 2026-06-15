import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  /**
   * ATENÇÃO: 
   * - Usando o IP detectado nos seus logs: 192.168.0.3
   * - Adicionada a porta 8080 padrão do Spring Boot
   */
  baseURL: 'http://10.5.0.152:8080/api/v1',
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Erro ao recuperar token do SecureStore', e);
  }
  return config;
});

export default api;
X