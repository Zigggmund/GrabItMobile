import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import { GetReviewsResponseDto } from '@/services/api/services/dto/review.dto';

export class ReviewService {
  // получение отзывов по объявлению
  static async getUserReviews(
    userId: string | number,
    params?: { page?: number; page_size?: number; sort_by?: string },
  ): Promise<GetReviewsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<GetReviewsResponseDto>>(
        `/rent/users/${userId}/reviews`,
        { params },
      ),
    );
  }

  // получение отзывов по объявлению
  static async getAdReviews(
    adId: string | number,
    params?: { page?: number; page_size?: number; sort_by?: string },
  ): Promise<GetReviewsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<GetReviewsResponseDto>>(
        `/rent/listings/${adId}/reviews`,
        { params },
      ),
    );
  }
}
