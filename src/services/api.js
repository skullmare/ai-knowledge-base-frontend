import axios from 'axios';
import { createAuthRefresh } from 'axios-auth-refresh';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,
});

const refreshAuthLogic = (failedRequest) =>
  api.post('/auth/refresh', {}, { skipAuthRefresh: true })
    .then((response) => {
      const newToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      
      failedRequest.response.config.headers['Authorization'] = `Bearer ${newToken}`;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return Promise.resolve();
    })
    .catch((err) => {
      localStorage.removeItem('accessToken');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
      return Promise.reject(err);
    });

createAuthRefresh(api, refreshAuthLogic);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;