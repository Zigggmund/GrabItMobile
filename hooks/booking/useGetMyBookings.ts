import { BookingStatus, GetBookingsResponseDto } from '@/services/api/services/dto/booking.dto';

import { useQuery } from '@tanstack/react-query';

import { PAGE_SIZE } from '@/constants/sizes';
import { BookingService } from '@/services/api/services/bookingService';

export const useGetMyBookings = (status: BookingStatus | undefined, page = 1) =>
  useQuery<GetBookingsResponseDto>({
    queryKey: ['myBookings', status, page],
    queryFn: () => BookingService.getMyBookings({ status, page, page_size: PAGE_SIZE }),
  });