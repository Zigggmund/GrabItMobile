import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import { useHistory } from '@/hooks/useHistory';

import { AuthService } from '@/services/api/services/authService';

export const useLogin = () => {
  const { navigate } = useHistory();

  return useMutation({
    mutationFn: async () => {
      const code = await AuthService.login();
      return await AuthService.exchangeToken(code);
    },

    onSuccess: async res => {
      const token = res.data.accessToken;
      await SecureStore.setItemAsync('accessToken', token);
      navigate('/(tabs)/ads/search');
    },

    onError: error => {
      console.log(error);
      navigate('/(auth)/login');
    },
  });
};

// export const useProfileLogin = () => {
//   const { setUser } = useProfile();
//   const { navigate } = useHistory();
//   // логин возвращает access и refresh токены
//   // получаем юзера по токену через infoUser
//   return useMutation({
//     mutationKey: ['user'],
//     // mutationFn: ({ login, password }: { login: string; password: string }) =>
//     //   AuthService.login(login, password),
//     mutationFn: () => AuthService.login(),
//     onSuccess: async () => {
//       const user = await UserService.infoUser();
//       setUser(user.data);
//       navigate(`/(tabs)/ads/search`);
//     },
//     onError: error => {
//       console.log(error);
//       navigate(`/(auth)/login`);
//     },
//   });
// };
