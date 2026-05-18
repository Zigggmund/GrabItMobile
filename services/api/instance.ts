import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

// продакшен
// export const API_URL = `https://grabit.localhost:8443/api/v1/mobile`;

export const API_URL = `https://grabit.test/api/v1/mobile`;

// обращение по adb reverse. теперь localhost на телефоне обращается к localhost пк
// export const API_URL = 'http://localhost:8080/api/v1/mobile';

export const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('accessToken');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
