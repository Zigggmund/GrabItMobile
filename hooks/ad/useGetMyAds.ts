import { MyAdStatus } from '@/types/entities/AdType';

import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/constants/sizes';

import { AdService } from '@/services/api/services/adService';
import { SearchListingsResponseDto } from '@/services/api/services/dto/ad.dto';

export const useGetMyAds = (status: MyAdStatus, page = 1) => {
  return useQuery<SearchListingsResponseDto>({
    queryKey: ['myAds', status, page],
    queryFn: async () => {
      return await AdService.getMyAds({
        status,
        page,
        page_size: PAGE_SIZE,
      });
    },
  });
};
