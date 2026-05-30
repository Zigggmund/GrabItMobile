import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToastType, toastService } from '@/services/toastService';
import { CustomText } from '@/components/ui/text/CustomText';

const BG_COLORS: Record<ToastType, string> = {
  error: '#FF2424',
  success: '#0BB31F',
  info: '#3F3E77',
};

const AUTO_DISMISS_MS = 3500;

// Глобальный toast-компонент.
// Регистрирует себя в toastService при монтировании. Один раз в RootLayout
export function AppToast() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('error');
  const [visible, setVisible] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [opacity, translateY]);

  const show = useCallback(
    (msg: string, t: ToastType) => {
      if (timer.current) clearTimeout(timer.current);

      setMessage(msg);
      setType(t);
      setVisible(true);

      // Анимация появления
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      // Автоскрытие
      timer.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    },
    [opacity, translateY, dismiss],
  );

  useEffect(() => {
    toastService.register(show);
    return () => toastService.register(null);
  }, [show]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 12,
          backgroundColor: BG_COLORS[type],
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={dismiss} style={styles.inner}>
        <CustomText
          style={{ color: '#FFFFFF' }}
          className={'text-15 font-medium text-center'}
          numberOfLines={3}
        >
          {message}
        </CustomText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  inner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
