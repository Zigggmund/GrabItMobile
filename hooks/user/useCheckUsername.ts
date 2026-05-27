import { useQuery } from '@tanstack/react-query';

import { UserService } from '@/services/api/services/userService';

export const useCheckUsername = (username: string) => {
  return useQuery({
    queryKey: ['users', 'check-username', username],
    queryFn: () => UserService.checkUsername(username),
    select: data => data.available,
    enabled: username.length >= 6,
    staleTime: 30_000, // кеш на 30 сек
  });
};
