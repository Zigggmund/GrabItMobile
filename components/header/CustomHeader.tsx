import { View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import CitySelector from '@/components/header/CitySelector';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';

import { icons } from '@/constants/icons';
import { CustomText } from '@/components/ui/text/CustomText';

interface CustomHeaderProps {
  hasBack?: boolean;
  isUserProfile?: boolean;
  isUserNotifications?: boolean;
  isSettingsScreen?: boolean;
}

export default function CustomHeader({
  hasBack = false,
  isUserProfile = false,
  isUserNotifications = false,
  isSettingsScreen = false,
}: CustomHeaderProps) {
  const { colors } = useTheme();
  const { user } = useProfile();
  const { goBack, navigate } = useHistory();
  const hasSettings = isSettingsScreen || isUserProfile;
  const hasArrow = hasBack && !isUserProfile && !isSettingsScreen;
  const hasNotifications = !hasSettings && !hasArrow;
  const notifications = { count: 5 };

  // console.log(
  //   'hasback:',
  //   hasBack,
  //   'isUserProfile:',
  //   isUserProfile,
  //   'isSettingsScreen:',
  //   isSettingsScreen,
  // );

  if (!user) return null;
  // console.log(user, '-', user?.username);

  return (
    <>
      <View
        style={{ backgroundColor: colors.theme.white.bright }}
        className={'flex-row px-2 py-1 items-center'}
      >
        {/* НАСТРОЙКИ */}
        {hasSettings && (
          <CustomIcon
            className="mr-3"
            color={
              isSettingsScreen
                ? colors.base.orange.primary
                : colors.components.icon.navIcon.bg
            }
            source={icons.settings}
            size={40}
            onPress={() => navigate('/(tabs)/users/settings')}
          />
        )}
        {/* СТРЕЛКА */}
        {hasArrow && (
          <CustomIcon
            className={'mr-3'}
            color={colors.components.icon.navIcon.bg}
            source={icons.arrowBack}
            onPress={goBack}
            size={30}
          />
        )}
        {/*УВЕДЫ*/}
        {hasNotifications && (
          <View className={'relative'}>
            <CustomIcon
              color={
                isUserNotifications
                  ? colors.base.orange.primary
                  : colors.components.icon.navIcon.bg
              }
              // source={user.avatar ? { uri: user.avatar } : icons.profile}
              source={icons.notifications}
              size={50}
              borderRadius={10}
              className={'mr-3'}
              onPress={() =>
                navigate({
                  pathname: '/(tabs)/users/[username]',
                  params: { username: user?.username },
                })
              }
            >
            </CustomIcon>
            <CustomText className={'text-15 absolute right-4 top-2s px-1'} style={{ borderRadius: 10, color: colors.base.neutral.whitePrimary, backgroundColor: colors.base.red.primary }}>{notifications.count}</CustomText>
          </View>
        )}
        <View
          style={{ backgroundColor: colors.theme.white.bright }}
          className={'flex-row flex-1 justify-between items-center'}
        >
          {/*ГОРОД*/}
          <CitySelector />
          {/* ПРОФИЛЬ */}
          <CustomIcon
            color={
              isUserProfile
                ? colors.base.orange.primary
                : colors.components.icon.navIcon.bg
            }
            // source={user.avatar ? { uri: user.avatar } : icons.profile}
            source={icons.profile}
            size={70}
            borderRadius={10}
            onPress={() =>
              navigate({
                pathname: '/(tabs)/users/[username]',
                params: { username: user?.username },
              })
            }
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.components.line.headerFooter.bg,
        }}
        className={'h-0.5 w-full'}
      />
    </>
  );
}
