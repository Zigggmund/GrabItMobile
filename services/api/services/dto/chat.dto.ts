// ─── Enums ────────────────────────────────────────────────────────────────────

export type BookingEventType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'booking_cancelled'
  | '';

// ─── Nested last_message in conversation ─────────────────────────────────────
// Comes from embedded proto struct serialized via encoding/json.
// Fields with omitempty may be absent when zero value (false, "", 0).
// Timestamps are Protobuf Timestamp objects {seconds, nanos}, NOT RFC3339 strings.

export interface ProtoTimestamp {
  seconds: number;
  nanos: number;
}

export interface ConversationLastMessageDto {
  message_id: string;
  conversation_id?: string;
  sender_id: string;
  message_type?: 0 | 1; // 0=text, 1=system; omitted if 0
  event_type?: string;
  content: string;
  reference_id?: string;
  is_deleted?: boolean;
  is_edited?: boolean;
  sent_at: ProtoTimestamp; // proto Timestamp — конвертировать через tsToISO
  read_at?: string; // RFC3339; omitted (not null) if message not read
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ConversationDto {
  conversation_id: string;
  listing_id: string;
  listing_title: string;
  booking_id?: string; // omitted if no attached booking
  renter_id?: string;
  owner_id?: string;
  unread_count?: number; // omitted when 0 due to proto omitempty
  last_message?: ConversationLastMessageDto; // omitted for new conversations with no messages
  is_muted?: boolean; // omitted when false due to proto omitempty
  blocked_by_me?: boolean;
  blocked_by_them?: boolean;
  created_at: string;
  last_message_at: ProtoTimestamp | undefined; // proto Timestamp — конвертировать через tsToISO
  // enriched by BFF
  listing_cover_url: string;
  listing_deleted: boolean;
  other_username: string;
  other_avatar_url: string;
}

export interface ConversationsPageDto {
  items: ConversationDto[];
  has_more: boolean;
}

// MessageDto — from GET /conversations/{id}/messages and WS events.
// The BFF explicitly converts proto → MessageResp with snake_case and *string for read_at.
export interface MessageDto {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  message_type: 0 | 1; // 0=text, 1=system
  event_type: string | null; // null for regular messages, booking event string for system
  content: string;
  reference_id: string | null; // null for regular messages, booking_id for system
  is_deleted: boolean;
  is_edited: boolean;
  sent_at: string; // RFC3339
  read_at: string | null; // null = not read
  edited_at: string | null;
}

export interface MessagesPageDto {
  items: MessageDto[];
  has_more: boolean;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateConversationDto {
  listing_id: string;
}

export interface SendMessageDto {
  content: string;
}

export interface EditMessageDto {
  content: string;
}

export interface GetMessagesParams {
  before?: string; // cursor: load messages older than this id
  after?: string; // cursor: catch-up after reconnect
  limit?: number;
}

export interface MarkReadDto {
  last_message_id: string;
}

// ─── WebSocket shapes ─────────────────────────────────────────────────────────

export interface WsIncomingEvent {
  kind: 'message' | 'system' | 'typing';
  message?: MessageDto;
}

export interface WsOutgoingMessage {
  type: 'message';
  content: string;
}

export interface WsOutgoingTyping {
  type: 'typing';
}
