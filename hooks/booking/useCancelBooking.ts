import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => BookingService.cancelBooking(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myBookings'] });
      qc.invalidateQueries({ queryKey: ['adBookings'] });
      qc.invalidateQueries({ queryKey: ['ownerBookings'] });
    },
  });
};