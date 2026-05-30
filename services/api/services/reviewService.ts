import { AxiosResponse } from 'axios';
import { ReviewType } from '@/types/entities/ReviewType';
import { api } from '@/services/api/instance';
import { ApiResponse } from '@/services/api/apiResponse';
import { GetReviewsResponseDto } from '@/services/api/services/dto/review.dto';
import { unwrap } from '@/services/api/apiUtils';


export class ReviewService {

  // получение отзывов по пользователю
  static async getUserReviews(
    userId: string | number,
  ): Promise<AxiosResponse<ReviewType[]>> {
    console.log('Getting user reviews attempt, userId:', userId);
    return api.get('/review');
  }

  // получение отзывов по объявлению
  static async getAdReviews(
    adId: string | number,
    params?: { page?: number; page_size?: number },
  ): Promise<GetReviewsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<GetReviewsResponseDto>>(`/rent/listings/${adId}/reviews`, { params }),
    );
  }
}
