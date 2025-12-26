import axios from 'axios';

import { ip } from '@/ip_info';

export const API_URL = `http://${ip}:3001`;
// 'https://my-json-server.typicode.com/AlexanderAr-dev/mock-api';

export const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});
