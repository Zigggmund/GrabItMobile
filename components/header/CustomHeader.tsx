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
  isSettingsScreen?: boolean;
}

export default function CustomHeader({
  hasBack = false,
  isUserProfile = false,
  isSettingsScreen = false,
}: CustomHeaderProps) {
  const { colors } = useTheme();
  const { user } = useProfile();
  console.log('hasback', hasBack);
  console.log('isUserProfile', isUserProfile);
  console.log('isSettingsScreen', isSettingsScreen);

  return (
    <>
      <View
        style={{ backgroundColor: colors.theme.white.bright }}
        className={'flex-row px-3 py-1 items-center'}
      >
        {/* НАСТРОЙКИ */}
        {(isSettingsScreen || isUserProfile) && (
          <CustomIcon
            className="mr-3"
            color={
              isSettingsScreen
                ? colors.base.orange.primary
                : colors.theme.grey.dark
            }
            source={icons.settings}
            size={40}
            onPress={() => router.push('/(tabs)/users/settings')}
          />
        )}
        {/* СТРЕЛКА */}
        {hasBack && !isUserProfile && !isSettingsScreen && (
          <CustomIcon
            className={'mr-3'}
            color={colors.theme.grey.dark}
            source={icons.arrowBack}
            onPress={() => router.back()}
            size={30}
          />
        )}
        <View
          style={{ backgroundColor: colors.theme.white.bright }}
          className={'flex-row flex-1 justify-between items-center'}
        >
          <CitySelector />
          {/* ПРОФИЛЬ */}
          <CustomIcon
            color={
              isUserProfile
                ? colors.base.orange.primary
                : colors.theme.grey.dark
            }
            source={icons.profile}
            size={70}
            onPress={() => router.push(`/(tabs)/users/${user?.id}`)}
          />
        </View>
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
