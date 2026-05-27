import { AdPreviewType } from '@/types/entities/AdType';

import { useQuery } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

// хук для получения объявлений пользователя
export const useGetUserAds = (userId: number | string) => {
  return useQuery<AdPreviewType[]>({
    queryKey: ['userAds', userId],
    queryFn: async () => {
      const res = await AdService.getUserAds(userId);
      return res.data;
    },
  });
};
