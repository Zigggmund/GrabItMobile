import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { useProfile } from '@/hooks/useProfile';

import { AuthService } from '@/services/api/services/authService';

export const useProfileLogout = () => {
  const { setUser } = useProfile();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setUser(null);
      router.push('/(auth)/login');
    },
  });
};
