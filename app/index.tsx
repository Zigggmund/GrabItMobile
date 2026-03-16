import { Redirect } from 'expo-router';

import { useProfile } from '@/hooks/user/useProfile';

// !!!ЗДЕСЬ НЕ ИСПОЛЬЗУЕТСЯ useHistory.
// Index в (tabs) не находит, нужен явный редирект
export default function Index() {
  const { user } = useProfile();
  console.log(new Date(Date.now()).toISOString());
  console.log(new Date(Date.now() - 60 * 60 * 1000).toISOString());

  if (user == null) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/ads/search" />;
}
