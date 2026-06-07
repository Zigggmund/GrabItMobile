import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';

export const useRequestExtension = (adId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, newEndTime }: { bookingId: string; newEndTime: string }) =>
      BookingService.requestExtension(bookingId, newEndTime),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ad', adId] });
      qc.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
};
