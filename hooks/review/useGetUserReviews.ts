import { ReviewType } from '@/types/entities/ReviewType';
import { SortingReviewsType } from '@/types/SortingType';

import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/constants/sizes';

import { ReviewService } from '@/services/api/services/reviewService';
import { UserService } from '@/services/api/services/userService';

export const useGetUserReviews = (userId: string, page = 1, sortBy: SortingReviewsType = 'new') => {
  return useQuery<{ items: ReviewType[]; total: number }>({
    queryKey: ['userReviews', userId, page, sortBy],
    queryFn: async () => {
      const res = await ReviewService.getUserReviews(userId, {
        page,
        page_size: PAGE_SIZE,
        sort_by: sortBy,
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
