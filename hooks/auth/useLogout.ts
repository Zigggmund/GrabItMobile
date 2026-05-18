import { useMutation } from '@tanstack/react-query';

import { useHistory } from '@/hooks/useHistory';

import { AuthService } from '@/services/api/services/authService';
import * as SecureStore from 'expo-secure-store';

export const useProfileLogout = () => {
  const { navigate } = useHistory();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: async () => {
      await SecureStore.deleteItemAsync('accessToken');
      navigate('/(auth)/login');
    },
    onError: error => {
      console.log(error);
    },
  });
};
