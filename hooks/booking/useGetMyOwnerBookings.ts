import {
  BookingStatus,
  BookingWithAdResponseDto,
} from '@/services/api/services/dto/booking.dto';

import { useQuery } from '@tanstack/react-query';

import { PaginatedResponse } from '@/types/PaginatedResponse';

import { PAGE_SIZE } from '@/constants/sizes';
import { BookingService } from '@/services/api/services/bookingService';

export const useGetMyOwnerBookings = (status: BookingStatus | undefined, page = 1) =>
  useQuery<PaginatedResponse<BookingWithAdResponseDto>>({
    queryKey: ['ownerBookings', status, page],
    queryFn: () => BookingService.getMyOwnerBookings({ status, page, page_size: PAGE_SIZE }),
  });