import { useMutation } from '@tanstack/react-query';

import { useProfile } from '@/hooks/useProfile';

import { AuthService } from '@/services/api/services/authService';
import { UserService } from '@/services/api/services/userService';
import { useHistory } from '@/hooks/useHistory';

export const useProfileLogin = () => {
  const { setUser } = useProfile();
  const { navigate } = useHistory();
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ login, password }: { login: string; password: string }) =>
      AuthService.login(login, password),
    onSuccess: async () => {
      const user = await UserService.infoUser();
      setUser(user.data);
      navigate(`/(tabs)/ads/search`);
    },
    onError: error => {
      console.log(error);
      navigate(`/(auth)/login`);
    },
  });
};
