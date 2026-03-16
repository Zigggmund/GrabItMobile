import { useMutation } from '@tanstack/react-query';

import { useProfile } from '@/hooks/user/useProfile';

import { AuthService } from '@/services/api/services/authService';
import { UserService } from '@/services/api/services/userService';
import { useHistory } from '@/hooks/useHistory';

export const useProfileLogin = () => {
  const { setUser } = useProfile();
  const { navigate } = useHistory();
  // логин возвращает access и refresh токены
  // получаем юзера по токену через infoUser
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
