import { BookingStatus } from '@/services/api/services/dto/booking.dto';

export interface BookingType {
  id: string;
  listingId: string;
  renterId: string;
  quantity: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}