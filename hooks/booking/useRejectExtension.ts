import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';

export const useRejectExtension = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => BookingService.rejectExtension(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adBookings'] });
      qc.invalidateQueries({ queryKey: ['ownerBookings'] });
    },
  });
};