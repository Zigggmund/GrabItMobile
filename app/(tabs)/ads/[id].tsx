import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useGetAd } from '@/hooks/ad/useGetAd';
import { useGetAdShortenedReviews } from '@/hooks/review/useGetAdShortenedReviews';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { dateFormat } from '@/utils/dateFormat';
import { getRemainingTime } from '@/utils/getRemainingTime';

import { Category } from '@/components/common/Category';
import ErrorMessage from '@/components/common/ErrorMessage';
import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import RatingStars from '@/components/common/RatingStars';
import { Review } from '@/components/items/reviews/Review';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { images } from '@/constants/images';

export default function AdDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const { data: ad, isLoading: isLoading, isError: isError } = useGetAd(id);
  // !!! заменить на ad.reviews
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetAdShortenedReviews(id);

  if (isLoading || isReviewsLoading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  if (!ad)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAdNotFound} />
      </ScreenContainer>
    );

  const finishRent = () => {
    console.log('Rent was finished');
  };
  const extendRent = () => {
    // получение информации по myBookingId
    navigate({
      pathname: '/(tabs)/ads/booking/[id]',
      params: { id: ad?.id.toString() },
    });
  };
  const createChat = () => {
    // ЧТО ТО ВРОДЕ ТАКОГО
    // navigate({
    //   pathname: '/(tabs)/chats/[id]',
    //   params: { id: ad.landlord.toString() },
    // }
  };

  return (
    <ScreenContainer>
      <ScrollView className={'w-full px-6'}>
        <View className={'gap-4'}>
          {ad.myBooking && getRemainingTime(ad.myBooking.endTime) > 0 && (
            <GreyBlock className={'px-4 py-2 gap-2 mb-4'}>
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className={'text-18 font-bold'}
              >
                {l.rent}
              </CustomText>
              <View className={'flex-row gap-1'}>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-14'}
                >
                  {l.rentWillEnd}:
                </CustomText>
                <CustomText
                  style={{ color: colors.theme.blue.bright }}
                  className={'text-14 font-bold'}
                >
                  {getRemainingTime(ad.myBooking.endTime)} {l.hour}
                </CustomText>
              </View>

              <View className={'flex-row justify-between mb-3 mt-3'}>
                <CustomButton
                  type={'green'}
                  isSmall
                  text={l.btnExtend}
                  onPress={extendRent}
                  textClassName={'text-18'}
                />
                <CustomButton
                  type={'red'}
                  isSmall
                  textClassName={'text-18'}
                  text={l.btnFinish}
                  onPress={finishRent}
                />
              </View>
            </GreyBlock>
          )}

          <View className={'justify-between flex-row'}>
            <Category categoryId={ad.categoryId} />
            <CustomText
              style={{ color: colors.theme.grey.dark }}
              className={'text-18 font-bold'}
              highlight
            >
              {dateFormat(ad.createdDate)}
            </CustomText>
          </View>

          <Image
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.components.card.rent.border,
            }}
            source={{ uri: ad.previewImage.url }}
            height={250}
          />

          <CustomText
            className={'font-bold text-24 ml-4'}
            style={{ color: colors.theme.black.primary }}
            highlight
          >
            {ad.title}
          </CustomText>

          {/* ЦЕНА */}
          <GreyBlock className={'px-4 py-2 gap-2'}>
            <CustomText
              style={{ color: colors.theme.blue.primary }}
              className={'text-18 font-bold'}
            >
              {l.price}
            </CustomText>

            {
              // НЕИЗВЕСТНО КАК БУДУТ ХРАНИТСЯ cost, paymentUnit
            }
            {
              <FlatList
                horizontal={true}
                scrollEnabled={false}
                data={ad.cost}
                renderItem={({ item }) => (
                  <View className={'flex-row gap-1 mr-2 items-center'}>
                    <CustomText
                      style={{ color: colors.theme.blue.bright }}
                      className={'text-13 font-bold'}
                    >
                      {item.payment}
                    </CustomText>
                    <CustomText
                      style={{ color: colors.theme.blue.bright }}
                      className={'text-13'}
                    >
                      {l[item.priceUnit]}
                    </CustomText>
                  </View>
                )}
              />
            }
          </GreyBlock>

          {/* АРЕНДОДАТЕЛЬ */}
          <View className={'justify-between px-4 py-2 flex-row'}>
            <View className={'gap-2 flex-1'}>
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className={'text-18 font-bold'}
              >
                {l.landlord}
              </CustomText>
              <View className={'flex-row items-center'}>
                <CustomText
                  className={'flex-1 text-18 font-medium mr-2'}
                  style={{ color: colors.theme.black.primary }}
                  numberOfLines={1}
                >
                  {ad.landlord.username}
                </CustomText>
                <View className={'gap-1 flex-row'}>
                  <CustomText
                    style={{ color: colors.theme.blue.primary }}
                    className="font-bold text-14"
                  >
                    {ad.landlord.landlordRating ?? '-'}
                  </CustomText>
                  <CustomText
                    style={{ color: colors.theme.blue.primary }}
                    className={'mr-2 text-14'}
                  >
                    ({ad.landlord.reviewCount})
                  </CustomText>
                </View>
              </View>
            </View>

            <ProfileAvatar
              id={ad.landlord.id}
              source={ad.landlord.avatar}
              size={60}
            />
          </View>

          {/* ОЦЕНКА */}
          <GreyBlock className={'px-4 py-2 gap-2'}>
            <CustomText
              style={{ color: colors.theme.blue.primary }}
              className={'text-18 font-bold'}
            >
              {l.rating}
            </CustomText>
            <View className={'flex-row gap-1'}>
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className="font-bold text-14"
              >
                {ad.rating}
              </CustomText>
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className={'mr-3 text-14'}
              >
                ({ad.reviewCount})
              </CustomText>
              <RatingStars rating={ad.rating} />
            </View>
          </GreyBlock>

          <View className={'mr-20 ml-20'}>
            <CustomButton
              isSmall
              iconSize={20}
              textClassName={'text-18'}
              iconSource={icons.chat}
              onPress={createChat}
              text={l.btnMessage}
            />
          </View>

          {/* АДРЕС */}
          <GreyBlock className={'px-4 py-2 gap-2'}>
            <CustomText
              style={{ color: colors.theme.blue.primary }}
              className={'text-18 font-bold'}
            >
              {l.address}
            </CustomText>
            <CustomText
              style={{ color: colors.theme.blue.bright }}
              className={'text-14'}
            >
              {ad.address}
            </CustomText>
          </GreyBlock>

          <Image
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.components.card.rent.border,
              width: '100%',
            }}
            source={images.mapExample}
            height={180}
          />

          {/* ОПИСАНИЕ */}
          <GreyBlock className={'px-4 py-2 gap-4'}>
            <View className={'gap-2'}>
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className={'text-18 font-bold'}
              >
                {l.description}
              </CustomText>
              <CustomText
                style={{ color: colors.theme.blue.bright }}
                className={'text-14'}
              >
                {ad.description}
              </CustomText>
            </View>
            {ad.specifications && (
              <View className={'gap-2'}>
                <CustomText
                  style={{ color: colors.theme.blue.primary }}
                  className={'text-18 font-bold'}
                >
                  {l.specifications}
                </CustomText>
                <FlatList
                  scrollEnabled={false}
                  data={ad.specifications}
                  renderItem={({ item }) => (
                    <View className={'gap-3 flex-row items-center'}>
                      {/* Using a bullet point unicode character */}
                      <CustomText
                        style={{ color: colors.theme.blue.bright }}
                        className={'text-4'}
                      >
                        {'\u2B24'}
                      </CustomText>
                      <CustomText
                        style={{ color: colors.theme.blue.bright }}
                        className={'text-14'}
                      >
                        {item}
                      </CustomText>
                    </View>
                  )}
                />
              </View>
            )}
          </GreyBlock>

          {/* КАЛЕНДАРЬ */}
          <CustomText
            style={{ color: colors.theme.blue.primary }}
            className={'text-22 font-bold'}
          >
            {l.bookingCalendar}
          </CustomText>
          <View className={'mr-20 ml-20'}>
            <CustomButton
              isSmall
              textClassName="text-19"
              onPress={() =>
                navigate({
                  pathname: '/(tabs)/ads/booking/[id]',
                  params: { id: id },
                })
              }
              text={l.btnSelectTime}
            />
          </View>

          {/* ОТЗЫВЫ */}
          <CustomText
            style={{ color: colors.theme.blue.primary }}
            className={'text-22 font-bold'}
          >
            {l.reviews}
          </CustomText>
          <FlatList
            scrollEnabled={false}
            data={reviews}
            renderItem={({ item, index }) => (
              <Review review={item} index={index} />
            )}
            ItemSeparatorComponent={() => <View className={'h-4'} />}
            ListEmptyComponent={() => (
              <CustomText
                highlight
                className={'text-28 text-center'}
                style={{ color: colors.theme.blue.primary }}
              >
                {l.emptyReviewList}
              </CustomText>
            )}
          />
          {ad.reviewCount > 3 && (
            <View className={'mr-16 ml-16'}>
              {reviews.length > 0 && (
                <CustomButton
                  textClassName="text-19"
                  onPress={() =>
                    navigate({
                      pathname: '/(tabs)/ads/reviews/[id]',
                      params: { id: id },
                    })
                  }
                  text={l.btnAllReviews}
                />
              )}
            </View>
          )}
          <View style={{ height: 0 }} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
