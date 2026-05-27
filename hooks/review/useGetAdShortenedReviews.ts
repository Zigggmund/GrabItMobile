import { ReviewType } from '@/types/entities/ReviewType';

import { useQuery } from '@tanstack/react-query';

import { ReviewService } from '@/services/api/services/reviewService';

// получение последних 3 отзывов по объявлению
export const useGetAdShortenedReviews = (adId: number | string) => {
  return useQuery<ReviewType[]>({
    queryKey: ['adShortenedReviews', adId],
    queryFn: async () => {
      const res = await ReviewService.getAdReviews(adId);
      // временно, должны получать только 3 отзыва
      return res.data.slice(0, 3);
    },
  });
};
