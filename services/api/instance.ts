import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

// продакшен
// export const API_URL = `https://grabit.localhost:8443/api/v1/mobile`;

export const API_URL = `https://grabit.test/api/v1/mobile`;
// export const API_URL = 'http://192.168.0.241/api/v1/mobile';;

// обращение по adb reverse. теперь localhost на телефоне обращается к localhost пк
// export const API_URL = 'http://localhost:8080/api/v1/mobile';

export const api = axios.create({
  // withCredentials: true, пока не нужно
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// перехватчик запросов для передачи токена
api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('token', token);
  }
  // @ts-expect-error sos
  console.log('REQUEST:', config.baseURL + config.url);
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
