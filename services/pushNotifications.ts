import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

import { NotificationService } from '@/services/api/services/notificationService';

const PUSH_TOKEN_KEY = 'pushToken';

export async function registerPushToken(): Promise<void> {
  // iOS simulator can't get a push token
  if (Platform.OS === 'ios' && !Device.isDevice) return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  // getDevicePushTokenAsync throws on emulators without Play Services
  const { data: token } = await Notifications.getDevicePushTokenAsync();
  const platform = Platform.OS as 'android' | 'ios';

  await NotificationService.registerDeviceToken({ token, platform });
  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
}

export async function unregisterPushToken(): Promise<void> {
  const token = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  if (!token) return;
  await NotificationService.unregisterDeviceToken(token);
  await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
}