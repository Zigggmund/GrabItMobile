import { ChatType } from '@/types/ChatType';

import { AxiosResponse } from 'axios';

import { api } from '@/services/api/instance';

export class ChatService {
  // получение чатов пользователя
  static async getUserChats(
    userId: string | number,
  ): Promise<AxiosResponse<ChatType[]>> {
    console.log('Getting chats by UserId attempt:', { userId });
    return api.get<ChatType[]>(`/chat`);
  }

  // получения чата по id
  static async getChat(
    chatId: string | number,
  ): Promise<AxiosResponse<ChatType>> {
    console.log('Getting chat by id attempt:', chatId);
    return api.get(`/chat/${chatId}`);
  }
}
