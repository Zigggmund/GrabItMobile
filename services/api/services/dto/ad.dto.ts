import { PaginatedResponse } from '@/types/PaginatedResponse';

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

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface AdResponseDto {
  listing_id: string;
  owner_id: string;
  title: string;
  description: string;
  category_id: number;
  price_per_hour: number;
  quantity: number;
  buffer_hours: number;
  lat: number | null;
  lon: number | null;
  address: string | null;
  status: 'active' | 'paused' | 'deleted';
  avg_rating: number;
  review_count: number;
  media: AdMediaDto[];
  attributes: AdAttributeDto[];
  created_at: string;
  updated_at: string;
}

export type SearchListingsResponseDto = PaginatedResponse<AdResponseDto>;

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
  min_price?: number; // ₽/час
  max_price?: number; // ₽/час
  lat?: number;
  lon?: number;
  radius_km?: number;
  // product_type?: string;
  // sort_by: string;
  page: number;
  page_size: number;
}

export interface CreateListingDto {
  title: string;
  description: string;
  category_id: number;
  price_per_hour: number;
  quantity: number;
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

