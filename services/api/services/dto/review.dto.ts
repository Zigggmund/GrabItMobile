import { PaginatedResponse } from '@/types/PaginatedResponse';

// ─── Response DTOs ────────────────────────────────────────────────────────────

/**
 * review_type возможные значения:
 *   'renter_to_listing' — арендатор оставляет отзыв об объявлении
 *   'renter_to_owner'   — арендатор оставляет отзыв о владельце
 *   'owner_to_renter'   — владелец оставляет отзыв об арендаторе
 */
export type ReviewType =
  | 'renter_to_listing'
  | 'renter_to_owner'
  | 'owner_to_renter';

export interface ReviewResponseDto {
  review_id: string;
  booking_id: string;
  listing_id: string;
  author_id: string;
  target_id: string | null; // null для renter_to_listing
  review_type: ReviewType;
  rating: number; // 1–5
  comment: string;
  created_at: string;
}

export type GetReviewsResponseDto = PaginatedResponse<ReviewResponseDto>;

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateReviewDto {
  review_type: ReviewType;
  rating: number;
  comment?: string;
}
