import { AdDetailsType } from '@/types/entities/AdType';

import { useQuery } from '@tanstack/react-query';

import { mapFullAd } from '@/hooks/ad/mapAd';
import { AdService } from '@/services/api/services/adService';
import { UserService } from '@/services/api/services/userService';

// хук для получения объявления по id
export const useGetAd = (adId: number | string) => {
  return useQuery<AdDetailsType>({
    queryKey: ['ad', adId],
    queryFn: async () => {
      const dto = await AdService.getAdById(adId);
      const owner = await UserService.getUserById(dto.owner_id);
      return mapFullAd(dto, owner);
    },
  });
};
