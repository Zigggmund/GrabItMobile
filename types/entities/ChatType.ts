import { MediaType } from '@/types/MediaType';
import { UserCardType } from '@/types/entities/UserType';

export interface MessageType {
  id: string;
  text: string;
  userId: string;
  date: string;
  isReceive: boolean;
  isRead: boolean;
  media?: MediaType[];
}

export interface ChatType {
  id: string;
  talker: UserCardType;
  adName: string;
  lastMessageDate: string;
  messages: MessageType[];
}
