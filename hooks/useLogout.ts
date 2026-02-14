import { useMutation } from '@tanstack/react-query';

import { useHistory } from '@/hooks/useHistory';
import { useProfile } from '@/hooks/useProfile';

import { AuthService } from '@/services/api/services/authService';

export const useProfileLogout = () => {
  const { setUser } = useProfile();
  const { navigate } = useHistory();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setUser(null);
      navigate('/(auth)/login');
    },
  });
};
