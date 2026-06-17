import { ReviewType } from '@/types/entities/ReviewType';
import { SortingReviewsType } from '@/types/SortingType';

import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/constants/sizes';

import { ReviewService } from '@/services/api/services/reviewService';
import { UserService } from '@/services/api/services/userService';

const UNKNOWN_AUTHOR = {
  id: '',
  username: '?',
  avatar_url: null as null,
  avg_rating_as_owner: 0,
  review_count_as_owner: 0,
  is_premium: false,
};

export const useGetAdReviews = (adId: string, page = 1, sortBy: SortingReviewsType = 'new', rating?: number[]) => {
  return useQuery<{ items: ReviewType[]; total: number }>({
    queryKey: ['adReviews', adId, page, sortBy, rating],
    queryFn: async () => {
      const res = await ReviewService.getAdReviews(adId, {
        page,
        page_size: PAGE_SIZE,
        sort: sortBy,
        rating,
      });
      const items = await Promise.all(
        res.items.map(async dto => {
          const author = await UserService.getUserById(dto.author_id).catch(() => UNKNOWN_AUTHOR);
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
