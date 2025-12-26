import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { AuthService } from '@/services/api/services/authService';

export const useProfileRegister = () => {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({
      login,
      password,
      email,
      language,
    }: {
      email: string;
      login: string;
      password: string;
      language: string;
    }) => AuthService.register(login, password, email, language),
    onSuccess: () => {
      router.push('/(auth)/login');
    },
    onError: error => {
      console.log(error);
      router.push('/(auth)/registration');
    },
  });
};
