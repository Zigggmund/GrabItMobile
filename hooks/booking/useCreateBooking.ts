import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateBookingDto } from '@/services/api/services/dto/booking.dto';
import { BookingService } from '@/services/api/services/bookingService';

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBookingDto) => BookingService.createBooking(dto),
    meta: { suppressGlobalError: true },
    onSuccess: (_, dto) => {
      qc.invalidateQueries({ queryKey: ['ad', dto.listing_id] });
    },
  });
};