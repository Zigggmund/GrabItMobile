import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import { useHistory } from '@/hooks/useHistory';
import { AuthService } from '@/services/api/services/authService';

export const useLogin = () => {
  const { navigate } = useHistory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const code = await AuthService.login();
      return await AuthService.exchangeToken(code);
    },

    onSuccess: async res => {
      // session_id используется как Bearer-токен во всех последующих запросах.
      // BFF-middleware сам подставляет реальный OAuth2 access token перед forwarding-ом.
      // console.log(`sessionId: ${res.sessionId}`);
      await SecureStore.setItemAsync('accessToken', res.sessionId);

      // Обновление профиля
      await queryClient.invalidateQueries({ queryKey: ['me'] });

      // console.log('useLogin', res, res.profileComplete);
      if (res.profileComplete) {
        navigate('/(tabs)/ads/search');
      } else {
        navigate('/(auth)/loginFinish');
      }
    },

    onError: () => {
      navigate('/(auth)/login');
    },
  });
};
