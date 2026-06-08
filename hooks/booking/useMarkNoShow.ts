import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookingService } from '@/services/api/services/bookingService';

export const useMarkNoShow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => BookingService.markNoShow(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adBookings'] });
      qc.invalidateQueries({ queryKey: ['ownerBookings'] });
    },
  });
};