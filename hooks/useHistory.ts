import { useContext } from 'react';

import { HistoryContext } from '@/context/HistoryContext';

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used inside LanguageProvider');
  return ctx;
};
