import { createContext } from 'react';
import { Href } from 'expo-router';

// export type HistoryItem = {
//   route: Href;
//   params?: Record<string, unknown>;
//   // isNotTransitional?: boolean;
// };

interface HistoryContextProps {
  historyStack: Href[];
  navigate: (item: Href) => void;
  goBack: () => void;
  clear: () => void;
}

export const HistoryContext = createContext<HistoryContextProps | null>(null);
