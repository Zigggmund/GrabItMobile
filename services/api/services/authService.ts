import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api, API_URL } from '@/services/api/instance';
import { LoginFinishDto } from '@/services/api/services/dto/auth.dto';

export class AuthService {
  // Редирект на кейклок; получение auth-кода
  static async login(): Promise<string> {
    const redirectUri = 'grabitmobile://loginFinish';
    const loginUrl = `${API_URL}/sso/login`;
    const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

    if (result.type !== 'success') {
      throw new Error('Login cancelled');
    }

    const { queryParams } = Linking.parse(result.url);
    const code = queryParams?.code;
    if (!code || typeof code !== 'string') {
      throw new Error('No auth code');
    }

    return code;
  }

  // Обмен auth code на session_id.
  static async exchangeToken(
    code: string,
  ): Promise<{ sessionId: string; profileComplete: boolean }> {
    const res = await api.post<
      ApiResponse<{ session_id: string; profile_complete: boolean }>
    >('/sso/exchange', { code });
    const data = unwrap(res);
    console.log('ExToken', data.session_id, data.profile_complete);
    return {
      sessionId: data.session_id,
      profileComplete: data.profile_complete,
    };
  }

  // Дозаполнение профиля после первого SSO-входа
  static async loginFinish(payload: LoginFinishDto): Promise<void> {
    unwrap(
      await api.post<ApiResponse<null>>('/users/me/profile/complete', payload),
    );
  }

  // Завершение сессии
  static async logout(): Promise<void> {
    await api.post('/sso/logout');
  }
}
