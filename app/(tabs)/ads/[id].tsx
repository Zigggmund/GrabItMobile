import { CostType } from '@/types/CostType';
import { ProductType } from '@/types/entities/AdType';
import { CategoryType } from '@/types/entities/CategoryType';

import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { useGetAd } from '@/hooks/ad/useGetAd';
import { useCreateConversation } from '@/hooks/chat/useCreateConversation';
import { useGetAdShortenedReviews } from '@/hooks/review/useGetAdShortenedReviews';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaPreview } from '@/hooks/useMediaPreview';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import { dateFormat } from '@/utils/dateFormat';
import { getRemainingTime } from '@/utils/getRemainingTime';

import { BookingBlock } from '@/components/calendar/BookingBlock';
import { ExtendBookingBlock } from '@/components/calendar/ExtendBookingBlock';
import { Category } from '@/components/common/Category';
import ErrorMessage from '@/components/common/ErrorMessage';
import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import RatingStars from '@/components/common/RatingStars';
import { Review } from '@/components/items/reviews/Review';
import ScreenContainer from '@/components/layout/ScreenContainer';
import AdMapModal from '@/components/modals/AdMapModal';
import { PreviewMediaModal } from '@/components/modals/PreviewMediaModal';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { images } from '@/constants/images';

const EMPTY_MAP_STYLE = { version: 8, sources: {}, layers: [] };

export default function AdDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { user: currentUser } = useProfile();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const queryClient = useQueryClient();
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const {
    visible: mediaVisible,
    uri: mediaUri,
    mediaType,
    openPreview,
    closePreview,
  } = useMediaPreview();
  const { data: ad, isLoading: isLoading, isError: isError } = useGetAd(id);
  // !!! заменить на ad.reviews
  const { data: reviewsData, isLoading: isReviewsLoading } =
    useGetAdShortenedReviews(id);

  const productType: ProductType = useMemo(() => {
    if (!ad) return 'product';
    const allCategories = [
      ...(queryClient.getQueryData<CategoryType[]>(['categories', 'product']) ??
        []),
      ...(queryClient.getQueryData<CategoryType[]>(['categories', 'service']) ??
        []),
      ...(queryClient.getQueryData<CategoryType[]>(['categories', 'space']) ??
        []),
    ];
    return (
      allCategories.find(c => c.id.toString() === ad.categoryId)?.productType ??
      'product'
    );
  }, [ad?.categoryId]);

  const prices: CostType[] = useMemo(() => {
    if (!ad) return [];
    const ph = ad.rub_per_hour;
    if (productType === 'space') {
      return [
        { payment: Math.round(ph * 24), priceUnit: 'rubPerDay' },
        { payment: Math.round(ph * 24 * 7), priceUnit: 'rubPerWeek' },
        { payment: Math.round(ph * 24 * 30), priceUnit: 'rubPerMonth' },
      ];
    }
    return [
      { payment: ph, priceUnit: 'rubPerHour' },
      { payment: Math.round(ph * 24), priceUnit: 'rubPerDay' },
      { payment: Math.round(ph * 24 * 7), priceUnit: 'rubPerWeek' },
    ];
  }, [ad, productType]);

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

  const { mutate: createConversation, isPending: isCreatingChat } =
    useCreateConversation();

  const finishRent = () => {
    console.log('Rent was finished');
  };
  const extendRent = () => setShowExtend(prev => !prev);
  const createChat = () => {
    createConversation(id, {
      onSuccess: conv => {
        navigate({
          pathname: '/(tabs)/chats/[id]',
          params: { id: conv.id },
        });
      },
    });
  };

  const isMine = ad.landlord.username == currentUser?.username;

  const total = reviewsData ? reviewsData.total : 0;
  const reviews = reviewsData ? reviewsData.items : [];

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

              {showExtend && (
                <ExtendBookingBlock
                  adId={id}
                  currentEndTime={ad.myBooking.endTime}
                  onClose={() => setShowExtend(false)}
                />
              )}
            </GreyBlock>
          )}

          {/* блок просмотра всех бронирований */}
          {isMine && (
            <CustomButton
              type={'highlighted'}
              textClassName="text-17"
              text={l.btnViewBookings}
              onPress={() =>
                navigate({
                  pathname: '/(tabs)/ads/bookings/[id]',
                  params: { id: id },
                })
              }
            />
          )}

          {/* общее */}
          <View className={'justify-between flex-row'}>
            {/*<Category categoryId={ad.categoryId} productType={ad.produtType} />*/}
            {/* ЗАГЛУШКА */}
            <Category categoryId={ad.categoryId} productType={'product'} />
            <CustomText
              style={{ color: colors.theme.grey.dark }}
              className={'text-18 font-bold'}
              highlight
            >
              {dateFormat(ad.createdDate)}
            </CustomText>
          </View>

          <Pressable
            onPress={() =>
              openPreview(ad.previewImage.url, ad.previewImage.mediaType)
            }
          >
            <Image
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.components.card.rent.border,
              }}
              source={
                ad.previewImage.url
                  ? { uri: ad.previewImage.url }
                  : images.defaultAd
              }
              height={250}
            />
          </Pressable>

          {ad.media.length > 1 && (
            <FlatList
              horizontal
              data={ad.media.filter(m => m.id !== ad.previewImage.id)}
              keyExtractor={(_, i) => i.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => openPreview(item.url, item.mediaType)}
                >
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    {item.mediaType === 'video' ? (
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#111',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <CustomText style={{ color: '#fff', fontSize: 22 }}>
                          ▶
                        </CustomText>
                      </View>
                    ) : (
                      <Image
                        source={{ uri: item.url }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </Pressable>
              )}
            />
          )}

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
                data={prices}
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
              username={ad.landlord.username}
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
              disabled={isMine || isCreatingChat}
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

          <View
            style={{
              height: 180,
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.components.card.rent.border,
            }}
          >
            <MapLibreGL.MapView
              style={{ flex: 1 }}
              mapStyle={EMPTY_MAP_STYLE}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <MapLibreGL.Camera
                zoomLevel={14}
                centerCoordinate={[ad.lon, ad.lat]}
              />
              <MapLibreGL.RasterSource
                id="adPreviewOsmSource"
                tileUrlTemplates={[
                  'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                ]}
                tileSize={256}
              >
                <MapLibreGL.RasterLayer id="adPreviewOsmLayer" />
              </MapLibreGL.RasterSource>
              <MapLibreGL.ShapeSource
                id="adPreviewMarkerSource"
                shape={{
                  type: 'Feature',
                  geometry: { type: 'Point', coordinates: [ad.lon, ad.lat] },
                  properties: {},
                }}
              >
                <MapLibreGL.CircleLayer
                  id="adPreviewMarkerCircle"
                  style={{
                    circleRadius: 10,
                    circleColor: colors.base.orange.primary,
                    circleStrokeWidth: 2,
                    circleStrokeColor: '#ffffff',
                  }}
                />
              </MapLibreGL.ShapeSource>
            </MapLibreGL.MapView>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onPress={() => setMapModalVisible(true)}
            />
          </View>

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
                {ad.description == '' ? '-' : ad.description}
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
                      {/* список с маркерами */}
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
                        {item.key}: {item.value}
                      </CustomText>
                    </View>
                  )}
                  ListEmptyComponent={() => (
                    <CustomText style={{ color: colors.theme.blue.bright }}>{l.emptySpecificationsList}</CustomText>
                  )}
                />
              </View>
            )}
          </GreyBlock>

          {/* КАЛЕНДАРЬ */}
          {!isMine && (
            <>
              <CustomText
                style={{ color: colors.theme.blue.primary }}
                className={'text-22 font-bold text-center'}
              >
                {l.bookingCalendar}
              </CustomText>
              <BookingBlock
                adId={id}
                minHoursInterval={ad.minHoursInterval}
                rubPerHour={ad.rub_per_hour}
              />
            </>
          )}

          {/* ОТЗЫВЫ */}
          <CustomText
            style={{ color: colors.theme.blue.primary }}
            className={'text-22 font-bold text-center'}
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
          {total > 3 && (
            <View className={'mr-16 ml-16'}>
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
            </View>
          )}
          <View style={{ height: 0 }} />
        </View>
      </ScrollView>

      {ad.lat !== null && ad.lon !== null && (
        <AdMapModal
          visible={mapModalVisible}
          onClose={() => setMapModalVisible(false)}
          lat={ad.lat}
          lon={ad.lon}
        />
      )}

      <PreviewMediaModal
        visible={mediaVisible}
        uri={mediaUri}
        mediaType={mediaType}
        onClose={closePreview}
      />
    </ScreenContainer>
  );
}
