import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateReviewDto } from '@/services/api/services/dto/review.dto';
import { ReviewService } from '@/services/api/services/reviewService';

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, dto }: { bookingId: string; dto: CreateReviewDto }) =>
      ReviewService.createReview(bookingId, dto),
    meta: { suppressGlobalError: true },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adReviews'] });
      qc.invalidateQueries({ queryKey: ['userReviews'] });
    },
  });
};
