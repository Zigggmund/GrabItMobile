import { UserType } from '@/types/UserType';

import { useQuery } from '@tanstack/react-query';

import { mapUser } from '@/hooks/user/mapUser';

import { UserService } from '@/services/api/services/userService';

// хук для получения пользователя по id
export const useGetUserById = (
  userId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<UserType>({
    queryKey: ['user', userId],
    enabled: options?.enabled,
    queryFn: async () => {
      const res = await UserService.getUserById(userId);
      return mapUser(res.data.data);
    },
  });
};
