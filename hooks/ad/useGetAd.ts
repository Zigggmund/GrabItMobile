import { AdDetailsType } from '@/types/AdType';

import { useQuery } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

// хук для получения объявления по id
export const useGetAd = (adId: number | string) => {
  return useQuery<AdDetailsType>({
    queryKey: ['ad', adId],
    queryFn: async () => {
      const { data } = await AdService.getAdById(adId);
      return data;
    },
  });
};
