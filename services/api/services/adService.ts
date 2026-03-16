import { AdDetailsType, AdPreviewType, AdRentedType } from '@/types/AdType';

import { AxiosResponse } from 'axios';

import { api } from '@/services/api/instance';

export class AdService {
  // получение всех объявлений
  static async getAllAds(): Promise<AxiosResponse<AdPreviewType[]>> {
    return api.get('/ad');
  }

  // получение объявлений, которые создал пользователь
  static async getUserAds(
    userId: number | string,
  ): Promise<AxiosResponse<AdPreviewType[]>> {
    console.log('Getting user ads by UserId attempt:', { userId });
    return api.get('/ad');
  }

  // получение объявлений, которые пользователь брал в аренду
  static async getUserRentedAds(
    userId: number | string,
  ): Promise<AxiosResponse<AdRentedType[]>> {
    console.log('Getting user rented ads by UserId attempt:', { userId });
    return api.get('/rentedAd');
  }

  // получение другого объявления по id
  static async getAdById(
    adId: number | string,
  ): Promise<AxiosResponse<AdDetailsType>> {
    console.log('Getting ad by id attempt:', { adId });
    return api.get(`/adDetails/${adId}`);
  }
}
