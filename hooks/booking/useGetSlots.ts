import { useQuery } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';

export const useGetSlots = (adId: string, date: string | null) =>
  useQuery<number[]>({
    queryKey: ['slots', adId, date],
    queryFn: () => BookingService.getSlots(adId, date!),
    enabled: !!date,
  });