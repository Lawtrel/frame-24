import axios from 'axios';

// A URL base da API foi inferida do README.md e API_ENDPOINTS.md
// Assumindo que o back-end está rodando em localhost:3000 (padrão de muitos frameworks)
// e que o front-end precisará de um proxy ou que ambos estarão na mesma rede (Docker)
// Para o desenvolvimento local, usaremos a porta padrão do NestJS (3000)
const api = axios.create({
  baseURL: 'http://localhost:3000/v1', // Base URL inferida
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
