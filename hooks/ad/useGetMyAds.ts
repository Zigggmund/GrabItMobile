import { AdResponseDto } from '@/services/api/services/dto/ad.dto';

import { useQuery } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

export type MyAdStatus = 'active' | 'paused' | 'deleted';

export const useGetMyAds = (status: MyAdStatus) => {
  return useQuery<AdResponseDto[]>({
    queryKey: ['myAds', status],
    queryFn: async () => {
      const res = await AdService.getMyListings({ status, page: 1, page_size: 50 });
      return res.items;
    },
  });
};