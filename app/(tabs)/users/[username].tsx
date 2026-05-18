import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useProfileLogout } from '@/hooks/auth/useLogout';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useGetUserByUsername } from '@/hooks/user/useGetUserByUsername';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import { dateFormat } from '@/utils/dateFormat';

import ErrorMessage from '@/components/common/ErrorMessage';
import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import RatingStars from '@/components/common/RatingStars';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

export default function UserProfile() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const profileLogout = useProfileLogout();
  const profile = useProfile();
  const { navigate } = useHistory();

  const { username } = useLocalSearchParams<{ username: string }>();

  const isMine = username == profile.user?.username;

  const {
    data: remoteUser,
    isLoading,
    isError,
  } = useGetUserByUsername(username, {
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
  if (!user) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorUserNotFound} />
      </ScreenContainer>
    );
  }
  if (isError) {
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
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
              {user?.username}
            </CustomText>

            <GreyBlock className={'flex-row justify-between'}>
              <ProfileAvatar source={user?.avatar} size={200} isProfilePage />
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
                  {l.registrationDate}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {dateFormat(user?.registrationDate)}
                </CustomText>
              </View>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17 '}
                >
                  {l.activeOffers}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.stats.offers}
                </CustomText>
              </View>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.landlordRating}:
                </CustomText>
                <View className={'flex-row gap-1'}>
                  <CustomText
                    style={{ color: colors.theme.blue.primary }}
                    className="font-bold text-14"
                  >
                    {user?.stats.landlordRating}
                  </CustomText>
                  <CustomText
                    style={{ color: colors.theme.blue.primary }}
                    className={'mr-3 text-14'}
                  >
                    ({user?.stats.landlordReviews})
                  </CustomText>
                  <RatingStars rating={user?.stats.landlordRating} />
                </View>
                {/*<CustomText*/}
                {/*  style={{ color: colors.theme.blue.primary }}*/}
                {/*  className={'text-17 font-bold'}*/}
                {/*>*/}
                {/*  {user?.stats.landlordRating ?? '-'}*/}
                {/*</CustomText>*/}
              </View>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.renterRating}:
                </CustomText>
                <View className={'flex-row gap-1'}>
                  <CustomText
                    style={{ color: colors.theme.blue.primary }}
                    className="font-bold text-14"
                  >
                    {user?.stats.renterRating}
                  </CustomText>
                  <CustomText
                    style={{ color: colors.theme.blue.primary }}
                    className={'mr-3 text-14'}
                  >
                    ({user?.stats.renterReviews})
                  </CustomText>
                  <RatingStars rating={user?.stats.renterRating} />
                </View>
                {/*<CustomText*/}
                {/*  style={{ color: colors.theme.blue.primary }}*/}
                {/*  className={'text-17 font-bold'}*/}
                {/*>*/}
                {/*  {user?.stats.landlordRating ?? '-'}*/}
                {/*</CustomText>*/}
              </View>
            </View>

            {/* Персональная информация */}
            <GreyBlock className={'px-2 mb-2'}>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.dark }}
                  className={'text-24 font-medium'}
                >
                  {l.personalInfo}
                </CustomText>
                {user?.isCompleted && (
                  <CustomButton
                    iconSource={icons.warning}
                    iconSize={30}
                    onPress={() => alert(l.warningFillProfile)}
                  />
                )}
              </View>
              {isMine && (
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
              )}
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.firstAndLastName}
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.firstName} {user?.lastName}
                </CustomText>
              </View>
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.birthDate}
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.birthDate}
                </CustomText>
              </View>
              {/*{user?.phoneNumber && (*/}
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.phoneNumber ?? '-'}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.phoneNumber}
                </CustomText>
              </View>
              {/*)}*/}
              {/*{user?.gender && (*/}
              <View className={'flex-row gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-17'}
                >
                  {l.gender ?? '-'}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-17 font-bold'}
                >
                  {user?.gender}
                </CustomText>
              </View>
              {/*)}*/}
            </GreyBlock>
            <View className={'px-24'}>
              <CustomButton
                textClassName={'text-24 font-medium'}
                className={'py-1.5'}
                text={l.btnEdit}
                onPress={() => {}}
              />
            </View>
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
              user.stats.offers > 0 && (
                <CustomButton
                  textClassName={'text-18'}
                  text={l.btnToOffers}
                  className={'mb-2'}
                  onPress={() =>
                    navigate({
                      pathname: '/(tabs)/users/landlordAds/[id]',
                      params: { id: user?.id, username: user?.username },
                    })
                  }
                />
              )
            )}

            {user.stats.landlordReviews > 0 && (
              <CustomButton
                textClassName={'text-18 font-medium'}
                className={'mb-6'}
                text={l.btnToReviews}
                onPress={() =>
                  navigate({
                    pathname: '/(tabs)/users/reviews/[id]',
                    params: {
                      id: user?.id,
                      username: user?.username,
                      reviewCount: user?.stats.landlordReviews,
                      userRating: user?.stats.landlordRating,
                    },
                  })
                }
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
