import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api, API_URL } from '@/services/api/instance';
import {
  ConversationDto,
  ConversationsPageDto,
  CreateConversationDto,
  GetMessagesParams,
  MarkReadDto,
  MessageDto,
  MessagesPageDto,
  SendMessageDto,
} from '@/services/api/services/dto/chat.dto';

export class ChatService {
  static async getConversations(params?: {
    page?: number;
    page_size?: number;
  }): Promise<ConversationsPageDto> {
    return unwrap(
      await api.get<ApiResponse<ConversationsPageDto>>(
        '/chat/conversations',
        { params },
      ),
    );
  }

  static async createConversation(
    dto: CreateConversationDto,
  ): Promise<ConversationDto> {
    return unwrap(
      await api.post<ApiResponse<ConversationDto>>(
        '/chat/conversations',
        dto,
      ),
    );
  }

  static async getMessages(
    conversationId: string,
    params?: GetMessagesParams,
  ): Promise<MessagesPageDto> {
    return unwrap(
      await api.get<ApiResponse<MessagesPageDto>>(
        `/chat/conversations/${conversationId}/messages`,
        { params },
      ),
    );
  }

  static async sendMessage(
    conversationId: string,
    dto: SendMessageDto,
  ): Promise<MessageDto> {
    return unwrap(
      await api.post<ApiResponse<MessageDto>>(
        `/chat/conversations/${conversationId}/messages`,
        dto,
      ),
    );
  }

  static async markRead(
    conversationId: string,
    dto: MarkReadDto,
  ): Promise<void> {
    await api.post(`/chat/conversations/${conversationId}/read`, dto);
  }

  static async getUnreadCount(): Promise<number> {
    const res = await unwrap(
      await api.get<ApiResponse<{ count: number }>>('/chat/unread-count'),
    );
    return res.count;
  }

  static getWsUrl(conversationId: string): string {
    return API_URL.replace(/^https?/, m => (m === 'https' ? 'wss' : 'ws')) +
      `/chat/conversations/${conversationId}/ws`;
  }
}