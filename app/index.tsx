import { Redirect } from 'expo-router';

import { useProfile } from '@/hooks/user/useProfile';

// срабатывает один раз после загрузки приложения
export default function Index() {
  const { user, isLoading } = useProfile();

  if (isLoading) return null;

  if (user == null) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!user.isCompleted) {
    return <Redirect href="/(auth)/loginFinish" />;
  }

  return <Redirect href="/(tabs)/ads/search" />;
}
