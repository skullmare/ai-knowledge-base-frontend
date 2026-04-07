import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,
});

const SKIP_REFRESH_URLS = ['/auth/refresh', '/auth/login', '/auth/logout'];

let accessToken = localStorage.getItem('accessToken') || null;
let refreshPromise = null; // ключевая штука — один промис на всех

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

// Request interceptor
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      SKIP_REFRESH_URLS.some((url) => originalRequest.url.includes(url))
    ) {
      return Promise.reject(error);
    }


    originalRequest._retry = true;

    // Если refresh уже идёт — все ждут один и тот же промис
    if (!refreshPromise) {
      refreshPromise = api
        .post('/auth/refresh', {})
        .then((res) => {
          const newToken = res.data.data.accessToken;
          setAccessToken(newToken);
          return newToken;
        })
        .catch((err) => {
          setAccessToken(null);
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
          return Promise.reject(err);
        })
        .finally(() => {
          refreshPromise = null; // сбрасываем после завершения
        });
    }

    // Все запросы ждут refresh и повторяются с новым токеном
    const newToken = await refreshPromise;
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest); // повторяем КАЖДЫЙ запрос
  }
);

export default api;