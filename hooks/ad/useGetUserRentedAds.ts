import { AdRentedType } from '@/types/AdType';

import { useQuery } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

// получение арендованных объявлений пользователя
export const useGetUserRentedAds = (userId: number | string) => {
  return useQuery<AdRentedType[]>({
    queryKey: ['rentedAds', userId],
    queryFn: async () => {
      const { data } = await AdService.getUserRentedAds(userId);
      return data;
    },
  });
};
