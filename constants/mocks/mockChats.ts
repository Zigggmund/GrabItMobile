import { ChatType } from '@/types/ChatType';
import { useGetUser } from '@/hooks/useGetUser';
import { mockUsers } from '@/constants/mocks/mockUsers';

// только для моков
const now = Date.now();
const hour = 60 * 60 * 1000;

export const mockChats: ChatType[] = [
  {
    id: 1,
    talker: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
    },
    adName: 'Ремонт квартир',
    lastMessageDate: new Date(now - 1000 * hour).toISOString(),
    messages: [
      {
        id: 1,
        text: 'How is the property condition?',
        userId: 3,
        date: new Date(now - 1140 * hour).toISOString(),
        isRead: true,
        isReceive: true,
      },
      {
        id: 2,
        text: 'I see, thanks for informing!',
        userId: 3,
        date: new Date(now - 1100 * hour).toISOString(),
        isRead: true,
        isReceive: true,
      },
      {
        id: 3,
        text: 'It’s nice myan for sure. You will love it',
        userId: 1,
        date: new Date(now - 1000 * hour).toISOString(),
        isRead: false,
        isReceive: true,
      },
      {
        id: 4,
        text: 'Thanks for contacting me!',
        userId: 1,
        date: new Date(now - 1000 * hour).toISOString(),
        isRead: false,
        isReceive: false,
      },
    ],
  },
  {
    id: 2,
    talker: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
    },
    adName: 'Ремонт гаража',
    lastMessageDate: new Date(now - 10 * hour).toISOString(),
    messages: [
      {
        id: 1,
        text: 'Здравствуйте, объявление актуально?',
        userId: 1,
        date: new Date(now - 10 * hour).toISOString(),
        isRead: false,
        isReceive: false,
      },
    ],
  },
  {
    id: 3,
    talker: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatar: mockUsers[1].avatar,
    },
    adName: 'Электродрель',
    lastMessageDate: new Date(now - 500 * hour).toISOString(),
    messages: [
      {
        id: 1,
        text: 'Здравствуйте, хочу арендовать дрель, завтра можно заехать?',
        userId: 1,
        date: new Date(now - 600 * hour).toISOString(),
        isRead: false,
        isReceive: true,
      },
      {
        id: 2,
        text: 'Ау...',
        userId: 1,
        date: new Date(now - 500 * hour).toISOString(),
        isRead: false,
        isReceive: true,
      },
    ],
  },
  {
    id: 4,
    talker: {
      id: mockUsers[3].id,
      name: mockUsers[3].name,
      avatar: mockUsers[3].avatar,
    },
    adName: 'Vr-очки',
    lastMessageDate: new Date(now).toISOString(),
    messages: [
      {
        id: 1,
        text: 'Не успеваю вернуть брат богом клянусь потом верну',
        userId: 4,
        date: new Date(now - 5 * hour).toISOString(),
        isRead: true,
        isReceive: true,
      },
      {
        id: 2,
        text: 'Время вышло. За просрок штраф будет',
        userId: 1,
        date: new Date(now).toISOString(),
        isRead: true,
        isReceive: true,
      },
    ],
  },
];
