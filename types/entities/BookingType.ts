import { BookingStatus } from '@/services/api/services/dto/booking.dto';

export interface BookingExtensionEntity {
  id: string;
  bookingId: string;
  newEndTime: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface BookingType {
  id: string;
  listingId: string;
  renterId: string;
  quantity: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  cancelledBy?: 'owner' | 'renter' | 'system';
  totalPrice: number;
  createdAt: string;
  pendingExtension?: BookingExtensionEntity;
}