import {
  AttemptLeaveCallbackType,
  AttemptLeaveResultType,
  ActionType,
} from '@/types/SubscriptionType';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { Href, router, usePathname } from 'expo-router';

import { HistoryContext } from '@/context/HistoryContext';

const formPages: Href[] = [
  '/ads/createAd',
  '/login',
  '/registration',
  '/ads/booking',
];

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const defaultPage: Href = '/(tabs)/ads/search';
  const [historyStack, setHistoryStack] = useState<Href[]>([]);
  const pathname = usePathname();

  // Множество(set) всех подписчиков
  const attemptLeaveSubscribers = useRef<Set<AttemptLeaveCallbackType>>(
    new Set(),
  );
  const subscribeAttemptLeave = (cb: AttemptLeaveCallbackType) => {
    attemptLeaveSubscribers.current.add(cb);
  };
  const unsubscribeAttemptLeave = (cb: AttemptLeaveCallbackType) => {
    attemptLeaveSubscribers.current.delete(cb);
  };
  // !Паттерн Mediator (HistoryProvider - Посредник, передает управление FormProvider)
  // !Паттерн Observer (FormProvider подписывается на History и реагирует на GoBack события)
  // Попытка покинуть текущую страницу
  const tryLeave = async (action: ActionType): Promise<AttemptLeaveResultType> => {
    // если хоть один подписчик вернул false - переход отменяется
    for (const cb of attemptLeaveSubscribers.current) {
      const canLeave = await cb(action);
      // если хоть один колллбэк не allow - прерываем goBack
      if (canLeave != 'allow') return canLeave;
    }
    return 'allow';
  };

  // системное перемещение
  useEffect(() => {
    console.log('STACK: stack was updated:', historyStack);
    const onBackPress = () => {
      if (historyStack.length > 0) {
        goBack();
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => {
      subscription.remove();
    };
  }, [historyStack]);

  // прослушивание через pathname и автоматическое обновление стека
  useEffect(() => {
    if (!pathname) return;

    setHistoryStack(prev => {
      if (prev[prev.length - 1] === pathname) {
        // if
        return prev;
      } else {
        return [...prev, pathname as Href];
      }
    });
  }, [pathname]);

  // ВСПОМОГАТЕЛЬНЫЕ функции
  // НЕ НУЖНА, уже есть прослушивание через pathname. иначе не учитывает табы
  // добавить элемент
  // const push = (item: Href) => {
  //   setHistoryStack(prev => [...prev, item]);
  //   console.log('STACK: stack was updated:', historyStack);
  // };
  // удалить последний элемент и вернуть его
  // const pop = (): Href => {
  //   const newStack = [...historyStack];
  //   newStack.pop();
  //   setHistoryStack(newStack);
  //   // console.log('STACK: stack was updated:', historyStack);
  //   return newStack[newStack.length - 1];
  // };

  // ОСНОВНЫЕ функции
  // переход на страницу и пуш в стек
  const navigate = async (item: Href, needConfirm = true) => {
    // if (needConfirm && formContext) {
    //   const shouldContinue = await formContext.shouldNavigateFromForm();
    //   if (!shouldContinue) return;
    // }
    if (needConfirm) {
      const canLeave = await tryLeave('navigate');
      if (canLeave == 'block' || canLeave == 'handled') return;
    }
    router.push(item);
  };

  // Тупой goBack возврат на последнюю и откат стека
  const internalGoBack = () => {
    const newStack = [...historyStack];
    if (newStack.length > 0) newStack.pop();
    // скип страниц-форм
    while (
      newStack.length != 0 &&
      formPages.some(formPage =>
        newStack[newStack.length - 1]
          .toString()
          .startsWith(formPage.toString()),
      )
    ) {
      newStack.pop();
    }

    const lastItem: Href =
      newStack.length == 0 ? defaultPage : newStack[newStack.length - 1];
    setHistoryStack(newStack);
    router.replace(lastItem);
  };

  // Умный goBack, перенаправляет
  const goBack = async () => {
    // if (formContext) {
    //   formContext.formGoBack();
    //   return;
    // }
    const canLeave = await tryLeave('goBack');
    // useCallback для предотвращения повторного создания функции
    if (canLeave === 'block') return;
    if (canLeave === 'handled') return;
    internalGoBack();
  };

  const clear = () => {
    setHistoryStack([]);
    console.log('HistoryStack was cleared');
  };

  return (
    <HistoryContext.Provider
      value={{
        historyStack,
        navigate,
        goBack,
        clear,
        subscribeAttemptLeave,
        unsubscribeAttemptLeave,
        tryLeave,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
