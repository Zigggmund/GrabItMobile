import { AdRentedType } from '@/types/entities/AdType';

import { useQuery } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

// получение арендованных объявлений пользователя
export const useGetUserRentedAds = (userId: number | string) => {
  return useQuery<AdRentedType[]>({
    queryKey: ['rentedAds', userId],
    queryFn: async () => {
      const res = await AdService.getUserRentedAds(userId);
      return res.data;
    },
  });
};
