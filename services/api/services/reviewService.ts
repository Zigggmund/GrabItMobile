import { AxiosResponse } from 'axios';
import { ReviewType } from '@/types/ReviewType';
import { api } from '@/services/api/instance';


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
    AdId: string | number,
  ): Promise<AxiosResponse<ReviewType[]>> {
    console.log('Getting ad reviews attempt, adId:', AdId);
    return api.get('/review');
  }
}
