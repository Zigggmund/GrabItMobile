import { useMutation } from '@tanstack/react-query';

import { UserChangingDto } from '@/services/api/services/dto/user.dto';
import { UserService } from '@/services/api/services/userService';

export const useChangeProfile = () => {
  return useMutation({
    mutationFn: (payload: UserChangingDto) => UserService.changeMe(payload),
    // Ошибки обрабатываются EditProfileModal
    meta: { suppressGlobalError: true },
  });
};
