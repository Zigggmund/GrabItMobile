import { useMutation } from '@tanstack/react-query';

import { useHistory } from '@/hooks/useHistory';

import { AuthService } from '@/services/api/services/authService';
import { LoginFinishDto } from '@/services/api/services/dto/auth.dto';

export const useLoginFinish = () => {
  const { navigate } = useHistory();

  return useMutation({
    mutationFn: async (payload: LoginFinishDto) => {
      return await AuthService.loginFinish(payload);
    },

    onSuccess: async () => {
      navigate('/(tabs)/ads/search');
    },

    onError: error => {
      console.log(error);
    },
  });
};

// export const useProfileLoginFinish = () => {
//   const { navigate } = useHistory();
//   return useMutation({
//     mutationKey: ['userPublicInfo'],
//     mutationFn: ({
//
//     }: {
//       login: string;
//       password: string;
//       email: string;
//       language: string;
//     }) => AuthService.loginFinish(login, password, email, language),
//     onSuccess: () => {
//       navigate('/(tabs)/ads/search');
//     },
//     onError: error => {
//       console.log(error);
//       navigate('/(auth)/loginFinish');
//     },
//   });
// };
