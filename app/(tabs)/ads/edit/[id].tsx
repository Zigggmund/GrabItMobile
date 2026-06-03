import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetAd } from '@/hooks/ad/useGetAd';

import { FormProvider } from '@/context/FormProvider';

import ErrorMessage from '@/components/common/ErrorMessage';
import { EditAdForm } from '@/components/forms/adEdit/EditAdForm';
import ScreenContainer from '@/components/layout/ScreenContainer';

export default function EditAdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: ad, isLoading, isError } = useGetAd(id);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !ad) {
    return (
      <ScreenContainer>
        <ErrorMessage text="Ошибка загрузки объявления" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FormProvider>
        <EditAdForm ad={ad} />
      </FormProvider>
    </ScreenContainer>
  );
}
