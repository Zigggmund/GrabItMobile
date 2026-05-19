import { AxiosResponse } from 'axios';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { api, API_URL } from '@/services/api/instance';
import { LoginFinishDto } from '@/services/api/services/dto/auth.dto';

export class AuthService {
  static async login() {
    console.log('Login attempt');
    const redirectUri = 'grabitmobile://loginFinish';
    console.log('redirectUri:', redirectUri);
    const loginUrl = `${API_URL}/sso/login`;
    console.log('loginUrl:', loginUrl);
    const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);
    console.log('AUTH RESULT:', JSON.stringify(result, null, 2));

    if (result.type !== 'success') {
      throw new Error('Login cancelled');
    }

    const { queryParams } = Linking.parse(result.url);
    console.log('QUERY PARAMS:', queryParams);
    const code = queryParams?.code;
    if (!code || typeof code !== 'string') {
      throw new Error('No auth code');
    }

    return code;
    // return '5c56b302-f3da-450e-9fb0-5c2913905263.ba1fcc4d-5cb9-4e7e-9823-eac3c8c28f28.631efb21-4b37-4056-a60a-b30b061ff48a';
  }

  // static async login() {
  //   // console.log('Login attempt');
  //   // const redirectUri = Linking.createURL('callback');
  //   // const redirectUri = 'grabitmobile://sso/callback';
  //   const redirectUri = 'grabitmobile://loginFinish';
  //   console.log('redirect: ', redirectUri);
  //   const loginUrl = `${API_URL}/sso/login`;
  //   console.log('loginUrl:', loginUrl);
  //   const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);
  //   console.log('result:', result);
  //
  //   if (result.type === 'success') {
  //     console.log('success:');
  //     const { queryParams } = Linking.parse(result.url);
  //
  //     const code = queryParams?.code;
  //     console.log('code:', code);
  //
  //     if (!code) throw new Error('No code');
  //
  //     return this.getAuthToken(code as string);
  //   }
  //
  //   throw new Error('Login cancelled');
  // }

  static async loginFinish(payload: LoginFinishDto) {
    console.log('Login finish attempt:', payload);
    return api.post(`/users/me/profile/complete`, payload);
  }

  static async exchangeToken(code: string) {
    // : Promise<AxiosResponse<{ accessToken: string }>>

    try {
      const r = await fetch('https://grabit.test/api/v1/mobile/sso/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });

      console.log('status', r.status);
      console.log(await r.text());
    } catch (e) {
      console.log('FETCH ERROR', e);
    }

    // try {
    //   console.log('Get token attempt:', { code });
    //   const result = await api.post(`/sso/exchange`, { code });
    //   console.log('Response: ', result.data);
    //   return result;
    // } catch (e: any) {
    //   console.log('FULL ERROR:', JSON.stringify(e, null, 2));
    //   console.log('MESSAGE:', e.message);
    //   console.log('STATUS:', e.response?.status);
    //   console.log('DATA:', e.response?.data);
    //   console.log('HEADERS:', e.response?.headers);
    //   console.log('CODE:', e.code);
    // }
  }

  static async logout(): Promise<AxiosResponse<{ message: string }>> {
    console.log('Logout attempt');
    return api.post(`/sso/logout`);
  }
}
