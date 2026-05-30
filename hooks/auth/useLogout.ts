import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import { AuthService } from '@/services/api/services/authService';

export const useProfileLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      await SecureStore.deleteItemAsync('accessToken');
      queryClient.setQueryData(['me'], null);
    },
  });
};
