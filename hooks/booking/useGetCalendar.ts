import { useQuery } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';
import { ListingCalendarResponseDto } from '@/services/api/services/dto/booking.dto';

export const useGetCalendar = (adId: string, year: number, month: number) =>
  useQuery<ListingCalendarResponseDto>({
    queryKey: ['calendar', adId, year, month],
    queryFn: () => BookingService.getCalendar(adId, year, month),
  });
