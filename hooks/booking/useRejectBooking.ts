import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';

export const useRejectBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => BookingService.rejectBooking(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adBookings'] });
      qc.invalidateQueries({ queryKey: ['ownerBookings'] });
    },
  });
};