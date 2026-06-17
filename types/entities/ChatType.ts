export type BookingEventType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'booking_expired'
  | 'booking_active'
  | 'booking_completed'
  | 'booking_no_show'
  | 'booking_extension_requested'
  | 'booking_extended'
  | 'booking_extension_rejected'
  | '';

export interface MessageEntity {
  id: string;
  conversationId: string;
  senderId: string;
  isSystem: boolean;
  eventType: BookingEventType;
  content: string;
  referenceId: string;
  isDeleted: boolean;
  isEdited: boolean;
  sentAt: string;
  readAt: string | null;
}

export interface ConversationEntity {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCoverUrl: string;
  listingDeleted: boolean;
  renterId: string;
  ownerId: string;
  otherUsername: string;
  otherAvatarUrl: string;
  unreadCount: number;
  lastMessage: MessageEntity | null;
  isMuted: boolean;
  blockedByMe: boolean;
  blockedByThem: boolean;
  lastMessageAt: string;
}