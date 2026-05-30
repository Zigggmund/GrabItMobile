import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHistory } from '@/hooks/useHistory';

import { AuthService } from '@/services/api/services/authService';
import { LoginFinishDto } from '@/services/api/services/dto/auth.dto';

export const useLoginFinish = () => {
  const { navigate } = useHistory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginFinishDto) => {
      return await AuthService.loginFinish(payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/(tabs)/ads/search');
    },
  });
};
