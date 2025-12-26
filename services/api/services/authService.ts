import { AxiosResponse } from 'axios';

import { api } from '@/services/api/instance';

export class AuthService {
  static async login(
    login: string,
    password: string,
  ): Promise<AxiosResponse<{ id: number; message: string }>> {
    console.log('Login attempt:', { login, password });
    // Временно get пока заглушка
    // return api.post('/login', { email, password });

    return api.get('/login/1');
  }

  static async register(
    login: string,
    email: string,
    password: string,
    language: string = 'ru',
  ): Promise<AxiosResponse<{ message: string }>> {
    console.log('Register attempt:', { login, email, password, language });
    // Временно get пока заглушка
    // return api.post('/register', {
    //   login,
    //   email,
    //   password,
    //   language,
    // });
    return api.get('/register/1');
  }

  static async logout(): Promise<AxiosResponse<{ message: string }>> {
    // Временно get пока заглушка
    // return api.post('/logout');
    return api.get('/logout/1');
  }
}
