import { ReviewType } from '@/types/ReviewType';

import { useQuery } from '@tanstack/react-query';

import { ReviewService } from '@/services/api/services/reviewService';

// получение всех отзывов по объявлению
export const useGetAdReviews = (adId: number | string) => {
  return useQuery<ReviewType[]>({
    queryKey: ['adReviews', adId],
    queryFn: async () => {
      const { data } = await ReviewService.getAdReviews(adId);
      return data;
    },
  });
};
