import { useMutation } from '@tanstack/react-query';

import { AuthService } from '@/services/api/services/authService';
import { useHistory } from '@/hooks/useHistory';

export const useProfileRegister = () => {
  const { navigate } = useHistory();
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({
      login,
      password,
      email,
      language,
    }: {
      login: string;
      password: string;
      email: string;
      language: string;
    }) => AuthService.register(login, password, email, language),
    onSuccess: () => {
      navigate('/(auth)/login');
    },
    onError: error => {
      console.log(error);
      navigate('/(auth)/registration');
    },
  });
};
