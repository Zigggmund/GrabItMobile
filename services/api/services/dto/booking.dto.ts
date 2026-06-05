import { PaginatedResponse } from '@/types/PaginatedResponse';

// ─── Response DTOs ────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface BookingResponseDto {
  booking_id: string;
  listing_id: string;
  renter_id: string;
  quantity: number;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export type GetBookingsResponseDto = PaginatedResponse<BookingResponseDto>;

export interface BookingAdInfo {
  listing_id: string;
  title: string;
  price_per_hour: number;
  address: string;
  cover_url: string | null;
  avg_rating: number;
  review_count: number;
}

export interface BookingWithAdResponseDto extends BookingResponseDto {
  listing: BookingAdInfo;
}

export type GetOwnerBookingsResponseDto = PaginatedResponse<BookingWithAdResponseDto>;

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateBookingDto {
  listing_id: string;
  quantity: number;
  start_time: string; // ISO 8601, e.g. "2026-06-15T10:00:00Z"
  end_time: string;
}

export interface ExtendBookingDto {
  new_end_time: string;
}

export interface RejectBookingDto {
  reason?: string;
}

export interface CancelBookingDto {
  reason?: string;
}

export interface GetBookingsRequestDto {
  status?: BookingStatus;
  page?: number;
  page_size?: number;
  // day?: string; // TODO: filter by overlap with day (backend pending)
}
