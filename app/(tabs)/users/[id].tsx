import { ActivityIndicator, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useGetUser } from '@/hooks/useGetUser';
import { useLanguage } from '@/hooks/useLanguage';
import { useProfileLogout } from '@/hooks/useLogout';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

export default function UserProfile() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const profileLogout = useProfileLogout();
  const profile = useProfile();

  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Number(id);

  const isMine = userId == profile.user?.id;

  const {
    data: remoteUser,
    isLoading,
    isError,
  } = useGetUser(userId, {
    enabled: !isMine,
  });

  const user = isMine ? profile.user : remoteUser;

  if (!isMine && isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (!user || isError) {
    return (
      <ScreenContainer>
        <CustomText
          style={{ color: colors.base.red.bright }}
          highlight
          className={'text-60'}
        >
          {l.errorUserNotFound}
        </CustomText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className={'flex-col h-full px-4 justify-between gap-8'}>
          <View>
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              className={'text-center text-33 font-bold pb-2'}
              highlight
            >
              {user?.name}
            </CustomText>

            <GreyBlock className={'flex-row justify-between'}>
              <ProfileAvatar
                source={user?.avatar?.url}
                size={200}
                isProfilePage
              />
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className={'text-13 w-2/5 align-middle'}
                numberOfLines={10}
              >
                {user?.description}
              </CustomText>
            </GreyBlock>

            <View className={'gap-1.5 pt-4 pb-2 px-2'}>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.reviews}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.stats.reviews}
                </CustomText>
              </View>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.rating}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.stats.rating == 0 ? '-' : user?.stats.rating}
                </CustomText>
              </View>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17 '}
                >
                  {l.offers}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.stats.offers}
                </CustomText>
              </View>
            </View>

            {isMine && (
              <>
                <GreyBlock className={'px-2 mb-2'}>
                  <CustomText
                    style={{ color: colors.theme.blue.dark }}
                    className={'text-24 font-medium'}
                  >
                    {l.personalInfo}
                  </CustomText>
                  <View className={'flex-row gap-2'}>
                    <CustomText
                      style={{ color: colors.theme.blue.bright }}
                      className={'text-17'}
                    >
                      {l.login}:
                    </CustomText>
                    <CustomText
                      style={{ color: colors.theme.blue.primary }}
                      className={'text-17 font-bold'}
                    >
                      {user?.login}
                    </CustomText>
                  </View>
                  <View className={'flex-row gap-2'}>
                    <CustomText
                      style={{ color: colors.theme.blue.bright }}
                      className={'text-17'}
                    >
                      {l.email}:
                    </CustomText>
                    <CustomText
                      style={{ color: colors.theme.blue.primary }}
                      className={'text-17 font-bold'}
                    >
                      {user?.email}
                    </CustomText>
                  </View>
                </GreyBlock>
                <View className={'px-24'}>
                  <CustomButton
                    textClassName={'text-24 font-medium'}
                    className={'py-1.5'}
                    text={l.btnEdit}
                    onPress={() => {}}
                  />
                </View>
              </>
            )}
          </View>

          <View className={'px-8'}>
            {isMine ? (
              <CustomButton
                iconSize={20}
                iconSource={icons.logout}
                textClassName={'text-18'}
                text={l.btnLogout}
                className="self-center mb-2"
                onPress={() => profileLogout.mutate()}
              />
            ) : (
              <CustomButton
                textClassName={'text-18'}
                text={l.btnToOffers}
                className={'mb-2'}
                onPress={() =>
                  router.push(`/(tabs)/users/landlordAds/${user?.id}`)
                }
              />
            )}

            <CustomButton
              textClassName={'text-18 font-medium'}
              className={'mb-6'}
              text={l.btnToReviews}
              onPress={() => router.push(`/(tabs)/users/reviews/${user?.id}`)}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
