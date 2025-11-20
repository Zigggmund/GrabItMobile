import { View } from 'react-native';
import { router } from 'expo-router';

import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';

import CitySelector from '@/components/header/CitySelector';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';

import { icons } from '@/constants/icons';

interface CustomHeaderProps {
  hasBack?: boolean;
  isUserProfile?: boolean;
}

export default function CustomHeader({
  hasBack = false,
  isUserProfile = false,
}: CustomHeaderProps) {
  const { colors } = useTheme();
  const { user } = useProfile();

  return (
    <>
      <View
        style={{ backgroundColor: colors.theme.white.bright }}
        className={'flex-row justify-between px-3 py-1 items-center '}
      >
        {/* НАСТРОЙКИ */}
        {hasBack && isUserProfile && (
          <CustomIcon
            color={colors.theme.grey.dark}
            source={icons.settings}
            size={40}
            onPress={() => router.push('/(tabs)/users/settings')}
          />
        )}
        {/* СТРЕЛКА */}
        {hasBack && !isUserProfile && (
          <CustomIcon
            className={'self-center'}
            color={colors.theme.grey.dark}
            source={icons.arrowBack}
            onPress={() => router.back()}
            size={30}
          />
        )}
        <CitySelector />
        {/* ПРОФИЛЬ */}
        <CustomIcon
          color={colors.theme.grey.dark}
          source={icons.profile}
          size={60}
          onPress={() => router.push(`/(tabs)/users/${user?.id}`)}
        />
      </View>
      <View
        style={{
          backgroundColor: colors.components.line.header.bg,
        }}
        className={'h-0.5 w-full'}
      />
    </>
  );
}
