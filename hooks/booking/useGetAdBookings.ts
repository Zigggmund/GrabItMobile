import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/constants/sizes';

import { BookingService } from '@/services/api/services/bookingService';
import {
  BookingStatus,
  GetBookingsResponseDto,
} from '@/services/api/services/dto/booking.dto';

export const useGetAdBookings = (
  adId: string,
  status: BookingStatus | undefined,
  page = 1,
  day?: string,
) =>
  useQuery<GetBookingsResponseDto>({
    queryKey: ['adBookings', adId, status, page, day],
    queryFn: () =>
      BookingService.getAdBookings(adId, {
        status,
        page,
        page_size: PAGE_SIZE,
        // day, // TODO: uncomment when backend supports day filter
      }),
  });