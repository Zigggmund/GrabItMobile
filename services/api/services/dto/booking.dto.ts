import { PaginatedResponse } from '@/types/PaginatedResponse';

// ─── Response DTOs ────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'no_show';

export interface BookingExtensionDto {
  id: string;
  booking_id: string;
  new_end_time: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface BookingResponseDto {
  booking_id: string;
  listing_id: string;
  renter_id: string;
  quantity: number;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  cancelled_by: 'owner' | 'renter' | 'system' | null;
  total_price: number;
  renter_is_premium: boolean;
  has_my_review: boolean;
  created_at: string;
  updated_at: string;
  pending_extension: BookingExtensionDto | null;
}

export type GetBookingsResponseDto = PaginatedResponse<BookingResponseDto>;

export interface BookingAdInfo {
  listing_id: string;
  owner_id: string;
  title: string;
  price_per_hour: number;
  address: string | null;
  status: string;
  avg_rating: number;
  review_count: number;
  cover_url: string | null;
  owner_is_premium: boolean;
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

export interface RequestExtensionDto {
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

// ─── Calendar ─────────────────────────────────────────────────────────────────

export interface CalendarDayDto {
  date: string;              // "YYYY-MM-DD"
  utilization: number | null; // 0–100 or null (non-working day)
}

export interface ListingCalendarResponseDto {
  listing_id: string;
  year: number;
  month: number;
  days: CalendarDayDto[];
}
