import { ReviewType } from '@/types/ReviewType';

import { mockUsers } from '@/constants/mocks/mockUsers';

// только для моков
const now = Date.now();
const hour = 60 * 60 * 1000;

export const mockReviews: ReviewType[] = [
  {
    id: 1,
    adName: 'Ремонт квартир',
    text:
      'Решил сделать капитальный ремонт в двухкомнатной квартире и выбрал эту компанию по совету знакомых. В целом остался очень доволен, хотя не обошлось без мелких шероховатостей.\n' +
      'Начну с главного — качество работы отличное. Стены идеально выровнены, плитка в ванной и на кухне лежит ровно, швы аккуратные и одинаковые, ничего не отходит и не трескается. Рабочие приходили вовремя, мусор выносили регулярно, в квартире всегда был порядок, насколько это вообще возможно во время ремонта.',
    user: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatar: mockUsers[1].avatar,
    },
    createdAt: new Date(now - 1000 * hour).toISOString(),
    rating: 4.5,
  },
  {
    id: 2,
    adName: 'Ремонт гаража',
    text: 'Хуже сервиса не встречал. Обещали одно, сделали совсем другое. Плинтусы отваливаются, углы кривые. Деньги заплачены, а нервов потратил море.',
    user: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatar: mockUsers[1].avatar,
    },
    createdAt: new Date(now - 1400 * hour).toISOString(),
    rating: 1.2,
  },
  {
    id: 3,
    adName: 'Ремонт гаража',
    text: 'Средненько. Обещали закончить за три недели — вышло почти месяц. Покраска стен местами неравномерная, исправили только после претензии. Цены нормальные, но контроль нужен.',
    user: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
    },
    createdAt: new Date(now - 1200 * hour).toISOString(),
    rating: 3.5,
  },
];
