import { useContext } from 'react';

import { ProfileContext } from '@/context/ProfileContext';

// ОТВЕЧАЕТ ЗА
// 1. Cмену пользователя
// 2. Проверку залогинен ли текущий юзер
// 3. Проверку на принадлежность нам сообщения и тд
export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error('useProfile must be used inside ProfileContextProvider');
  return ctx;
};
