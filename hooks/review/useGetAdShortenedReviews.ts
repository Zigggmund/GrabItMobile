import { ReviewType } from '@/types/entities/ReviewType';

import { useQuery } from '@tanstack/react-query';

import { ReviewService } from '@/services/api/services/reviewService';
import { UserService } from '@/services/api/services/userService';

// получение последних 3 отзывов по объявлению
export const useGetAdShortenedReviews = (adId: number | string) => {
  return useQuery<{ items: ReviewType[]; total: number }>({
    queryKey: ['adShortenedReviews', adId],
    queryFn: async () => {
      const res = await ReviewService.getAdReviews(adId, {
        page: 1,
        page_size: 3,
      });

      const items = await Promise.all(
        res.items.map(async dto => {
          const author = await UserService.getUserById(dto.author_id);
          return {
            id: dto.review_id,
            adName: '',
            text: dto.comment,
            author: {
              id: author.id,
              username: author.username,
              avatar: author.avatar_url,
              landlordRating: author.avg_rating_as_owner,
              reviewCount: author.review_count_as_owner,
              phoneNumber: null,
              isPremium: author.is_premium,
            },
            createdAt: dto.created_at,
            rating: dto.rating,
          };
        }),
      );

      return { items, total: res.total };
    },
  });
};
