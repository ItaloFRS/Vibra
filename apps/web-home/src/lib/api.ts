import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar respostas e erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('Sessão expirada ou não autorizado. Redirecionando para login...');
      // Em uma aplicação real, aqui redirecionaríamos para /login
      if (typeof window !== 'undefined') {
        // window.location.href = '/login';
      }
    }

    if (status === 403) {
      console.error('Você não tem permissão para acessar este recurso.');
    }

    if (status >= 500) {
      console.error('Erro interno no servidor. Tente novamente mais tarde.');
    }

    return Promise.reject(error);
  }
);
