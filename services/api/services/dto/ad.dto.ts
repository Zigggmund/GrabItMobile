import { PaginatedResponse } from '@/types/PaginatedResponse';
import { MyAdStatus } from '@/types/entities/AdType';

// ─── Media & Attributes ───────────────────────────────────────────────────────

export interface AdMediaDto {
  id: string;
  url: string;
  media_type: string; // 'photo' | 'video'
  sort_order: number;
}

export interface AdAttributeDto {
  key: string;
  value: string;
}

// ─── Category DTOs ────────────────────────────────────────────────────────────

export interface AdCategoryShortDto {
  id: number;
  name: string;
}

export interface AdCategoryDto extends AdCategoryShortDto {
  parent_id: number | null;
  slug: string;
  sort_order: number;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

// Full listing — GET /rent/listings/{id}
export interface AdResponseDto {
  listing_id: string;
  owner_id: string;
  title: string;
  description: string;
  category: AdCategoryDto;
  price_per_hour: number;
  // quantity: number;
  buffer_hours: number;
  lat: number | null;
  lon: number | null;
  address: string | null;
  status: 'active' | 'paused' | 'deleted';
  avg_rating: number;
  review_count: number;
  owner_is_premium: boolean;
  media: AdMediaDto[];
  attributes: AdAttributeDto[];
  created_at: string;
  updated_at: string;
  available_from: string | null;
  available_until: string | null;
}

// Search / my listings — GET /rent/listings, GET /rent/listings/my
export interface AdSummaryDto {
  listing_id: string;
  owner_id: string;
  title: string;
  category: AdCategoryShortDto;
  price_per_hour: number;
  address: string | null;
  lat: number | null;
  lon: number | null;
  status: 'active' | 'paused' | 'deleted';
  avg_rating: number;
  review_count: number;
  owner_is_premium: boolean;
  media: AdMediaDto[];
  created_at: string;
  available_from: string | null;
  available_until: string | null;
}

export type SearchListingsResponseDto = PaginatedResponse<AdSummaryDto>;

export interface UploadMediaResponseDto {
  media_id: string;
  url: string;
}

export interface AvailableSlotsResponseDto {
  date: string;
  available_hours: number[];
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface SearchListingsRequestDto {
  query?: string;
  category_id?: string;
  owner_id?: string;
  min_price?: number;
  max_price?: number;
  lat?: number;
  lon?: number;
  radius_km?: number;
  sort?: string;
  lang?: string;
  page: number;
  page_size: number;
}

export interface MyAdsRequestDto {
  status: MyAdStatus;
  page: number;
  page_size: number;
  lang?: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  category_id: number;
  price_per_hour: number;
  // quantity: number;
  buffer_hours?: number;
  lat?: number;
  lon?: number;
  address?: string;
  attributes?: AdAttributeDto[];
}

export interface UpdateListingDto {
  title?: string;
  description?: string;
  category_id?: number;
  price_per_hour?: number;
  quantity?: number;
  buffer_hours?: number;
  lat?: number;
  lon?: number;
  address?: string;
  attributes?: AdAttributeDto[];
}

export interface SetAvailabilityDto {
  periods: {
    valid_from: string;
    valid_until: string;
    weekday_hours: Record<string, number[]>; // ключ: '1'=пн … '7'=вс
  }[];
}
