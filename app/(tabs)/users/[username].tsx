import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { useProfileLogout } from '@/hooks/auth/useLogout';
import { useDeleteAvatar } from '@/hooks/media/useDeleteAvatar';
import { useHistory } from '@/hooks/useHistory';
import { useMediaPreview } from '@/hooks/useMediaPreview';
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
import AvatarUploadModal from '@/components/modals/AvatarUploadModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { PreviewMediaModal } from '@/components/modals/PreviewMediaModal';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { CustomAlert } from '@/components/modals/CustomAlert';

export default function UserProfile() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const profileLogout = useProfileLogout();
  const profile = useProfile();
  const { navigate } = useHistory();
  const queryClient = useQueryClient();
  const { visible, openPreview, closePreview, uri: imageUri } = useMediaPreview();

  const deleteAvatar = useDeleteAvatar();

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  // const [completeProfileModalVisible, setCompleteProfileModalVisible] =
  //   useState(false);

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
  useEffect(() => {
    console.log('avatar', user?.avatar);
  }, [user?.avatar]);

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

            <GreyBlock className={'items-center w-full gap-2 relative'}>
              <ProfileAvatar
                source={user.avatar}
                onPress={() => openPreview(user.avatar)}
                cacheBuster={avatarVersion}
                size={300}
                isProfilePage
              />
              {/*<CustomText*/}
              {/*  style={{ color: colors.theme.blue.primary }}*/}
              {/*  className={'text-13 w-2/5 align-middle'}*/}
              {/*  numberOfLines={10}*/}
              {/*>*/}
              {/*  {user?.description}*/}
              {/*</CustomText>*/}
              {isMine && (
                <>
                  <CustomButton
                    type={'red'}
                    disabled={user.avatar == null || deleteAvatar.isPending}
                    className={'absolute left-4 bottom-4'}
                    iconSize={35}
                    iconSource={icons.trash}
                    // textClassName={'text-16'}
                    // text={deleteAvatar.isPending ? l.loading : l.btnDelete}
                    onPress={async () => {
                      const confirmed = await CustomAlert({
                        message: l.warningDeleteAvatar,
                        confirmation: l.confirmation,
                        btnCancel: l.btnCancel,
                        btnConfirm: l.btnConfirm,
                      });
                      if (!confirmed) return;
                      deleteAvatar.mutate(undefined, {
                        onSuccess: () => {
                          queryClient.invalidateQueries({ queryKey: ['me'] });
                          setAvatarVersion(Date.now());
                        },
                      });
                    }}
                  />
                  <CustomButton
                    // textClassName={'text-16'}
                    // text={l.btnUpload}
                    className={'absolute right-4 bottom-4'}
                    type={'secondary'}
                    iconSize={35}
                    iconSource={icons.edit}
                    onPress={() => setAvatarModalVisible(true)}
                  />
                </>
              )}
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
            <GreyBlock className={'px-2 my-2 gap-1'}>
              <View
                className={'flex-row gap-3 justify-center items-center mb-2'}
              >
                <CustomText
                  style={{ color: colors.theme.blue.dark }}
                  className={'text-24 font-medium '}
                >
                  {l.personalInfo}
                </CustomText>
                {!user?.isCompleted && (
                  <CustomIcon
                    source={icons.warning}
                    size={30}
                    // iconSize={30}
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
              {/*{isMine && !user?.isCompleted ? (*/}
              {/*  <CustomButton*/}
              {/*  type={'secondary'}*/}
              {/*  textClassName={'text-18'}*/}
              {/*  text={l.btnFillProfile}*/}
              {/*  onPress={() => setCompleteProfileModalVisible(true)}*/}
              {/*  />*/}
              {/*) : (*/}
              {/*<>*/}
              {(user?.firstName || user?.lastName) && (
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
              )}
              {user.birthDate && (
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
              )}
              {user?.phoneNumber && (
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
              )}
              {user?.gender && (
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
              )}
              {isMine && (
                <View className={'px-24 pt-2'}>
                  <CustomButton
                    isSmall
                    iconSize={24}
                    iconSource={icons.edit}
                    type={'secondary'}
                    textClassName={'text-18 font-medium'}
                    className={'py-1.5'}
                    text={l.btnEdit}
                    onPress={() => setEditProfileModalVisible(true)}
                  />
                </View>
              )}
              {/*</>*/}
              {/*)}*/}
            </GreyBlock>
          </View>

          <View className={'px-8'}>
            {isMine ? (
              <CustomButton
                iconSize={20}
                type={'red'}
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
                  className={'mb-6'}
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
                text={l.btnToOwnerReviews}
                onPress={() =>
                  navigate({
                    pathname: '/(tabs)/users/reviews/[id]',
                    params: {
                      id: user?.id,
                      username: user?.username,
                      reviewCount: user?.stats.landlordReviews,
                      userRating: user?.stats.landlordRating,
                      role: 'owner',
                    },
                  })
                }
              />
            )}
          </View>
        </View>
      </ScrollView>

      <PreviewMediaModal
        visible={visible}
        uri={imageUri}
        onClose={closePreview}
      />

      {/* Модалки — только для своего профиля */}
      {isMine && user && (
        <>
          <AvatarUploadModal
            visible={avatarModalVisible}
            onClose={() => setAvatarModalVisible(false)}
            currentAvatarUrl={user.avatar}
            cacheBuster={avatarVersion}
            onAvatarChanged={() => setAvatarVersion(Date.now())}
          />
          <EditProfileModal
            visible={editProfileModalVisible}
            onClose={() => setEditProfileModalVisible(false)}
            user={user}
          />
          {/*<CompleteProfileModal*/}
          {/*  visible={completeProfileModalVisible}*/}
          {/*  onClose={() => setCompleteProfileModalVisible(false)}*/}
          {/*/>*/}
        </>
      )}
    </ScreenContainer>
  );
}
