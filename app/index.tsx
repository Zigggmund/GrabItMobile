import { Redirect } from 'expo-router';

import { useProfile } from '@/hooks/useProfile';

// index в (tabs) не находит, нужен явный редирект
export default function Index() {
  const { user } = useProfile();

  if (user == null) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/ads/search" />;
}
