import { useQuery } from '@tanstack/react-query';

import { UserService } from '@/services/api/services/userService';

export const useMe = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => UserService.infoUser(),
    retry: 1,
  });
};
