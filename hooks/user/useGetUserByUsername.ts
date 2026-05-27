import { useQuery } from '@tanstack/react-query';

import { mapUser } from '@/hooks/user/mapUser';
import { UserService } from '@/services/api/services/userService';
import { UserType } from '@/types/entities/UserType';

export const useGetUserByUsername = (
  username: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['user', username],
    enabled: options?.enabled,
    // Сервис возвращает UserResponseDto напрямую (unwrap внутри)
    queryFn: () => UserService.getUserByUsername(username),
    select: (data): UserType | null => {
      if (!data) return null;
      return mapUser(data);
    },
  });
};
