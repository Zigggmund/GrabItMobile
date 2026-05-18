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

  static async exchangeToken(
    code: string,
  )
    // : Promise<AxiosResponse<{ accessToken: string }>>
  {
    try {
      console.log('Get token attempt:', { code });
      const result = await api.post(`/sso/exchange`, { code });
      console.log('Response: ', result.data);
      return result;
    } catch (e: any) {
      console.log('FULL ERROR:', JSON.stringify(e, null, 2));
      console.log('MESSAGE:', e.message);
      console.log('CODE:', e.code);
    };

  }

  static async logout(): Promise<AxiosResponse<{ message: string }>> {
    console.log('Logout attempt');
    return api.post(`/sso/logout`);
  }
}
