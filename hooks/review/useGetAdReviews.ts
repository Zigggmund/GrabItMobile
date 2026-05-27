import { ReviewType } from '@/types/entities/ReviewType';

import { useQuery } from '@tanstack/react-query';

import { ReviewService } from '@/services/api/services/reviewService';

// получение всех отзывов по объявлению
export const useGetAdReviews = (adId: number | string) => {
  return useQuery<ReviewType[]>({
    queryKey: ['adReviews', adId],
    queryFn: async () => {
      const res = await ReviewService.getAdReviews(adId);
      return res.data;
    },
  });
};
