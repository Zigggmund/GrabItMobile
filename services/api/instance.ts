import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL = `https://grab-it.ru/api/v1/mobile`;

export const api = axios.create({
  // withCredentials: true, пока не нужно
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // повторяющиеся значения: rating=1&rating=2 (Go r.URL.Query()["rating"])
  paramsSerializer: { indexes: null },
});

// перехватчик запросов для передачи токена
api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log(config);
  return config;
});

// перехватчик ответов для логирования ошибок
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    // 401 — ожидаемое состояние (нет токена или истёк), не ошибка API
    if (status !== 401) {
      console.log('--- API ERROR DETECTED ---');
      console.log('URL:', error.config?.baseURL + error.config?.url);
      console.log('MESSAGE:', error.message);
      console.log('STATUS:', status);
      console.log('DATA:', error.response?.data);
      console.log('HEADERS:', error.response?.headers);
      console.log('CODE:', error.code);
      console.log('--------------------------');
    }

    return Promise.reject(error);
  },
);
