import {
  ActionType,
  AttemptLeaveCallbackType,
  AttemptLeaveResultType,
} from '@/types/SubscriptionType';

import { createContext } from 'react';
import { Href } from 'expo-router';

// export type HistoryItem = {
//   route: Href;
//   params?: Record<string, unknown>;
//   // isNotTransitional?: boolean;
// };

interface HistoryContextProps {
  historyStack: Href[];
  navigate: (item: Href, needConfirm?: boolean) => void;
  tryLeave: (action: ActionType) => Promise<AttemptLeaveResultType>;
  goBack: () => void;
  clear: () => void;
  subscribeAttemptLeave: (cb: AttemptLeaveCallbackType) => void;
  unsubscribeAttemptLeave: (cb: AttemptLeaveCallbackType) => void;
}

export const HistoryContext = createContext<HistoryContextProps | null>(null);
