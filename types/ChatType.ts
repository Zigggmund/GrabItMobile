import { MediaType } from '@/types/MediaType';
import { UserCardType } from '@/types/UserType';

export interface MessageType {
  id: number;
  text: string;
  userId: number;
  date: string;
  isReceive: boolean;
  isRead: boolean;
  media?: MediaType[];
}

export interface ChatType {
  id: number;
  talker: UserCardType;
  adName: string;
  lastMessageDate: string;
  messages: MessageType[];
}
