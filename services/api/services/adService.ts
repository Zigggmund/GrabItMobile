import {
  AdPreviewType,
  AdRentedType,
} from '@/types/entities/AdType';

import { AxiosResponse } from 'axios';

import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import {
  AdResponseDto,
  CreateListingDto, MyAdsRequestDto,
  SearchListingsRequestDto,
  SearchListingsResponseDto,
  SetAvailabilityDto,
  UpdateListingDto,
} from '@/services/api/services/dto/ad.dto';

export class AdService {
  static async searchListings(
    params: SearchListingsRequestDto,
  ): Promise<SearchListingsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<SearchListingsResponseDto>>('/rent/listings', {
        params,
      }),
    );
  }

  // получение всех объявлений (старый метод, пока не подключён к новому API)
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
  static async getAdById(adId: number | string): Promise<AdResponseDto> {
    return unwrap(
      await api.get<ApiResponse<AdResponseDto>>(`/rent/listings/${adId}`),
    );
  }

  // получение собственных объявлений (с фильтром по статусу)
  static async getMyAds(params?: MyAdsRequestDto): Promise<SearchListingsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<SearchListingsResponseDto>>('/rent/listings/my', { params }),
    );
  }

  static async pauseListing(listingId: string): Promise<void> {
    await unwrap<AdResponseDto>(
      await api.post<ApiResponse<AdResponseDto>>(`/rent/listings/${listingId}/pause`),
    );
  }

  static async resumeListing(listingId: string): Promise<void> {
    await unwrap<AdResponseDto>(
      await api.post<ApiResponse<AdResponseDto>>(`/rent/listings/${listingId}/resume`),
    );
  }

  static async deleteListing(listingId: string): Promise<void> {
    await unwrap<null>(
      await api.delete<ApiResponse<null>>(`/rent/listings/${listingId}`),
    );
  }

  // создание объявления
  static async createAd(dto: CreateListingDto): Promise<AdResponseDto> {
    return unwrap(
      await api.post<ApiResponse<AdResponseDto>>('/rent/listings', dto),
    );
  }

  static async updateAd(listingId: string, dto: UpdateListingDto): Promise<void> {
    await unwrap(
      await api.put<ApiResponse<null>>(`/rent/listings/${listingId}`, dto),
    );
  }

  // установка расписания доступности
  static async setAvailability(listingId: string, dto: SetAvailabilityDto): Promise<void> {
    await unwrap(
      await api.put<ApiResponse<null>>(`/rent/listings/${listingId}/availability`, dto),
    );
  }
}
