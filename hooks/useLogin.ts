import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { useProfile } from '@/hooks/useProfile';

import { AuthService } from '@/services/api/services/authService';
import { UserService } from '@/services/api/services/userService';

export const useProfileLogin = () => {
  const { setUser } = useProfile();
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ login, password }: { login: string; password: string }) =>
      AuthService.login(login, password),
    onSuccess: async () => {
      const user = await UserService.infoUser();
      setUser(user.data);
      router.push(`/(tabs)/ads/search`);
    },
    onError: error => {
      console.log(error);
      router.push(`/(auth)/login`);
    },
  });
};
