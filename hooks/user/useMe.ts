import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { mapUser } from '@/hooks/user/mapUser';

import { UserService } from '@/services/api/services/userService';

export const useMe = () => {
  return useQuery({
    // последующее обновление me в query только ВРУЧНУЮ (queryClient)
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await UserService.getMe();
        console.log('Current user data:', res);
        return res;
      } catch (error) {
        // 401 здесь - не ошибка (юзер пока не авторизован)
        if (isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    select: data => (data ? mapUser(data) : null),
    // Без повторных запросов — 401 не исчезнет от retry
    retry: false,
  });
};
