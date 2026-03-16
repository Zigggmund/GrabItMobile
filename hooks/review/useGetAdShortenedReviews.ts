import { ReviewType } from '@/types/ReviewType';

import { useQuery } from '@tanstack/react-query';

import { ReviewService } from '@/services/api/services/reviewService';

// получение последних 3 отзывов по объявлению
export const useGetAdShortenedReviews = (adId: number | string) => {
  return useQuery<ReviewType[]>({
    queryKey: ['adShortenedReviews', adId],
    queryFn: async () => {
      const { data } = await ReviewService.getAdReviews(adId);
      // временно, должны получать только 3 отзыва
      return data.slice(0, 3);
    },
  });
};
