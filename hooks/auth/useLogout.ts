import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import { useHistory } from '@/hooks/useHistory';
import { AuthService } from '@/services/api/services/authService';

export const useProfileLogout = () => {
  const { navigate } = useHistory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      await SecureStore.deleteItemAsync('accessToken');

      // Сбрасываем кэш профиля
      queryClient.removeQueries({ queryKey: ['me'] });

      navigate('/(auth)/login');
    },
  });
};
