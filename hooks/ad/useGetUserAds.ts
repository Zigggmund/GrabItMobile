import { AdPreviewType } from '@/types/entities/AdType';
import { SortingAdsType } from '@/types/SortingType';

import { useQuery } from '@tanstack/react-query';

import { mapAd } from '@/hooks/ad/mapAd';
import { PAGE_SIZE } from '@/constants/sizes';

import { AdService } from '@/services/api/services/adService';

export const useGetUserAds = (userId: string, sortBy: SortingAdsType = 'new', page = 1) => {
  return useQuery<{ items: AdPreviewType[]; total: number }>({
    queryKey: ['userAds', userId, sortBy, page],
    queryFn: async () => {
      const res = await AdService.searchListings({
        owner_id: userId,
        sort_by: sortBy,
        page,
        page_size: PAGE_SIZE,
      });
      return { items: res.items.map(mapAd), total: res.total };
    },
  });
};
