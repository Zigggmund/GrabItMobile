import { PaginatedResponse } from '@/types/PaginatedResponse';

import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import {
  BookingExtensionDto,
  BookingResponseDto,
  BookingWithAdResponseDto,
  CancelBookingDto,
  CreateBookingDto,
  GetBookingsRequestDto,
  GetBookingsResponseDto,
  GetOwnerBookingsResponseDto,
  ListingCalendarResponseDto,
  RejectBookingDto,
} from '@/services/api/services/dto/booking.dto';

export class BookingService {
  static async getCalendar(
    adId: string,
    year: number,
    month: number,
  ): Promise<ListingCalendarResponseDto> {
    return unwrap(
      await api.get<ApiResponse<ListingCalendarResponseDto>>(
        `/rent/listings/${adId}/calendar`,
        { params: { year, month } },
      ),
    );
  }

  static async getSlots(adId: string, date: string): Promise<number[]> {
    const res = await unwrap(
      await api.get<ApiResponse<{ date: string; available_hours: number[] }>>(
        `/rent/listings/${adId}/slots`,
        { params: { date } },
      ),
    );
    return res.available_hours;
  }

  static async createBooking(dto: CreateBookingDto): Promise<BookingResponseDto> {
    return unwrap(await api.post<ApiResponse<BookingResponseDto>>('/rent/bookings', dto));
  }

  static async getAdBookings(
    adId: string,
    params: GetBookingsRequestDto,
  ): Promise<GetBookingsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<GetBookingsResponseDto>>(
        `/rent/listings/${adId}/bookings`,
        { params },
      ),
    );
  }

  static async getMyBookings(params: GetBookingsRequestDto): Promise<GetBookingsResponseDto> {
    return unwrap(
      await api.get<ApiResponse<GetBookingsResponseDto>>('/rent/bookings/as-renter', { params }),
    );
  }

  static async getMyOwnerBookings(
    params: GetBookingsRequestDto,
  ): Promise<PaginatedResponse<BookingWithAdResponseDto>> {
    return unwrap(
      await api.get<ApiResponse<GetOwnerBookingsResponseDto>>('/rent/bookings/as-owner', {
        params,
      }),
    );
  }

  static async approveBooking(id: string): Promise<BookingResponseDto> {
    return unwrap(
      await api.post<ApiResponse<BookingResponseDto>>(`/rent/bookings/${id}/approve`),
    );
  }

  static async rejectBooking(id: string, reason?: string): Promise<BookingResponseDto> {
    const body: RejectBookingDto = reason ? { reason } : {};
    return unwrap(
      await api.post<ApiResponse<BookingResponseDto>>(`/rent/bookings/${id}/reject`, body),
    );
  }

  static async cancelBooking(id: string, reason?: string): Promise<BookingResponseDto> {
    const body: CancelBookingDto = reason ? { reason } : {};
    return unwrap(
      await api.post<ApiResponse<BookingResponseDto>>(`/rent/bookings/${id}/cancel`, body),
    );
  }

  static async requestExtension(id: string, newEndTime: string): Promise<BookingExtensionDto> {
    return unwrap(
      await api.post<ApiResponse<BookingExtensionDto>>(`/rent/bookings/${id}/extension`, {
        new_end_time: newEndTime,
      }),
    );
  }

  static async approveExtension(id: string): Promise<BookingResponseDto> {
    return unwrap(
      await api.post<ApiResponse<BookingResponseDto>>(`/rent/bookings/${id}/extension/approve`),
    );
  }

  static async rejectExtension(id: string): Promise<BookingExtensionDto> {
    return unwrap(
      await api.post<ApiResponse<BookingExtensionDto>>(`/rent/bookings/${id}/extension/reject`),
    );
  }

  static async markNoShow(id: string): Promise<BookingResponseDto> {
    return unwrap(
      await api.post<ApiResponse<BookingResponseDto>>(`/rent/bookings/${id}/no-show`),
    );
  }
}
