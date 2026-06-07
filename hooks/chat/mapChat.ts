import {
  BookingEventType,
  ConversationEntity,
  MessageEntity,
} from '@/types/entities/ChatType';
import {
  ConversationDto,
  ConversationLastMessageDto,
  MessageDto,
} from '@/services/api/services/dto/chat.dto';

export const SYSTEM_SENDER_ID = '00000000-0000-0000-0000-000000000000';

export function mapMessage(dto: MessageDto): MessageEntity {
  return {
    id: dto.message_id,
    conversationId: dto.conversation_id,
    senderId: dto.sender_id,
    isSystem: dto.message_type === 1 || dto.sender_id === SYSTEM_SENDER_ID,
    eventType: (dto.event_type ?? '') as BookingEventType,
    content: dto.content,
    referenceId: dto.reference_id ?? '',
    isDeleted: dto.is_deleted,
    isEdited: dto.is_edited,
    sentAt: dto.sent_at,
    readAt: dto.read_at,
  };
}

function mapLastMessage(
  dto: ConversationLastMessageDto,
): MessageEntity {
  return {
    id: dto.message_id,
    conversationId: dto.conversation_id ?? '',
    senderId: dto.sender_id,
    isSystem:
      (dto.message_type ?? 0) === 1 || dto.sender_id === SYSTEM_SENDER_ID,
    eventType: (dto.event_type ?? '') as BookingEventType,
    content: dto.content,
    referenceId: dto.reference_id ?? '',
    isDeleted: dto.is_deleted ?? false,
    isEdited: dto.is_edited ?? false,
    sentAt: dto.sent_at,
    readAt: dto.read_at ?? null,
  };
}

export function mapConversation(dto: ConversationDto): ConversationEntity {
  return {
    id: dto.conversation_id,
    listingId: dto.listing_id,
    listingTitle: dto.listing_title,
    listingCoverUrl: dto.listing_cover_url,
    listingDeleted: dto.listing_deleted,
    renterId: dto.renter_id ?? '',
    ownerId: dto.owner_id ?? '',
    otherUsername: dto.other_username,
    otherAvatarUrl: dto.other_avatar_url,
    unreadCount: dto.unread_count ?? 0,
    lastMessage: dto.last_message ? mapLastMessage(dto.last_message) : null,
    isMuted: dto.is_muted ?? false,
    blockedByMe: dto.blocked_by_me ?? false,
    blockedByThem: dto.blocked_by_them ?? false,
    lastMessageAt: dto.last_message_at,
  };
}