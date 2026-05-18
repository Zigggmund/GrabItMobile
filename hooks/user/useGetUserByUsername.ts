import { UserType } from '@/types/UserType';

import { useQuery } from '@tanstack/react-query';

import { mapUser } from '@/hooks/user/mapUser';

import { UserService } from '@/services/api/services/userService';

// хук для получения пользователя по username
export const useGetUserByUsername = (
  username: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<UserType>({
    queryKey: ['user', username],
    enabled: options?.enabled,
    queryFn: async () => {
      const res = await UserService.getUserByUsername(username);
      return mapUser(res.data.data);
    },
  });
};
