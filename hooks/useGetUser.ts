import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/api/services/userService';
import { UserType } from '@/types/UserType';

export const useGetUser = (
  userId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery<UserType>({
    queryKey: ['user', userId],
    enabled: options?.enabled,
    queryFn: async () => {
      const res = await UserService.getUserById(userId);
      return res.data;
    },
  });
};