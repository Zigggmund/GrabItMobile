import { AdPreviewType } from '@/types/entities/AdType';

import { useQuery } from '@tanstack/react-query';

import { AdService } from '@/services/api/services/adService';

// хук для получения всех объявлений (+фильтры?)
export const useGetAllAds = () => {
  return useQuery<AdPreviewType[]>({
    queryKey: ['ads'],
    queryFn: async () => {
      const res = await AdService.getAllAds();
      return res.data;
    },
  });
};
