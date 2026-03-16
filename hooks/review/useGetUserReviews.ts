import { ReviewType } from '@/types/ReviewType';

import { useQuery } from '@tanstack/react-query';

import { ReviewService } from '@/services/api/services/reviewService';

// получение всех отзывов по пользователю
export const useGetUserReviews = (userId: number | string) => {
  return useQuery<ReviewType[]>({
    queryKey: ['userReviews', userId],
    queryFn: async () => {
      const { data } = await ReviewService.getUserReviews(userId);
      return data;
    },
  });
};
