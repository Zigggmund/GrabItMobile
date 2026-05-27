import { useMutation } from '@tanstack/react-query';

import { UserService } from '@/services/api/services/userService';

export const useDeleteProfile = () => {
  return useMutation({
    mutationFn: async () => {
      return await UserService.deleteMe();
    },
  });
};
