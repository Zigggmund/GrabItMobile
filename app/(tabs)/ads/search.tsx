import { AdPreviewType, ProductType } from '@/types/entities/AdType';
import { CategoryType } from '@/types/entities/CategoryType';
import { SortingAdsType } from '@/types/SortingType';

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { useSearchAds } from '@/hooks/ad/useSearchAds';
import { useGetProductTypeCategories } from '@/hooks/category/useGetProductTypeCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { RootState } from '@/state/store';

import SearchBar from '@/components/common/bars/SearchBar';
import ErrorMessage from '@/components/common/ErrorMessage';
import { SortingMenu } from '@/components/common/SortingMenu';
import { Tag } from '@/components/common/Tag';
import SmallAd from '@/components/items/ads/SmallAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { MapPointModal } from '@/components/modals/MapPointModal';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

import {
  cityCoordinates,
  DEFAULT_CITY_RADIUS_KM,
} from '@/constants/cityCoordinates';
import { icons } from '@/constants/icons';
import { SMALL_AD_WIDTH } from '@/constants/sizes';

interface LocationFilter {
  lat: number;
  lon: number;
  radiusKm: number;
}

interface DraftFilters {
  category: CategoryType | null;

  minPriceText: string;
  maxPriceText: string;

  location: LocationFilter | null;
}

interface AppliedFilters {
  categoryId?: string;

  // backend всегда ₽/час
  minPrice?: number;
  maxPrice?: number;

  lat?: number;
  lon?: number;
  radiusKm?: number;
}

// фильтрация без "применить" при:
// 1. Поиск
// 2. сортировка

export default function Search() {
  const { l } = useLanguage();
  const { colors } = useTheme();

  const { width: screenWidth } = useWindowDimensions();
  const numColumns = Math.max(1, Math.floor(screenWidth / SMALL_AD_WIDTH));

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);

  const [selectedTag, setSelectedTag] = useState<ProductType | null>(null);

  // без указания categorySlug useGetProductTypeCategories ничего не возвращает
  const categorySlug = 'product';
  const categories = useGetProductTypeCategories(categorySlug).data;
  const [sortBy, setSortBy] = useState<SortingAdsType>('new');

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);

  const [locationMode, setLocationMode] = useState<'none' | 'city' | 'custom'>(
    'city',
  );

  const currentCity = useSelector((state: RootState) => state.city.currentCity);

  // Draft filters (UI state) - не вызывают API до "применить"
  const [draftFilters, setDraftFilters] = useState<DraftFilters>({
    category: null,

    minPriceText: '',
    maxPriceText: '',

    location: null,
  });

  // Applied filters - уходят в backend
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});

  const isSpace = selectedTag === 'space';
  const displayMultiplier = isSpace ? 24 : 1;
  const priceUnit = isSpace ? l.rubPerDay : l.rubPerHour;

  const { data, isLoading, isError, isFetching } = useSearchAds({
    query: debouncedSearch || undefined,

    sort_by: sortBy,

    // productType: appliedFilters
    categoryId: appliedFilters.categoryId,

    minPrice: appliedFilters.minPrice,
    maxPrice: appliedFilters.maxPrice,

    lat: appliedFilters.lat,
    lon: appliedFilters.lon,
    radiusKm: appliedFilters.radiusKm,

    page,
  });

  const [allAds, setAllAds] = useState<AdPreviewType[]>([]);

  useEffect(() => {
    if (!data?.items) return;
    setAllAds(prev => {
      if (page === 1) return data.items;
      const existingIds = new Set(prev.map(a => a.id));
      return [...prev, ...data.items.filter(a => !existingIds.has(a.id))];
    });
  }, [data]);

  const ads = allAds;
  const total = data?.total ?? 0;

  const handleApplyFilters = () => {
    const minRaw = draftFilters.minPriceText.trim();
    const maxRaw = draftFilters.maxPriceText.trim();
    const minInt = minRaw === '' ? null : parseInt(minRaw, 10);
    const maxInt = maxRaw === '' ? null : parseInt(maxRaw, 10);

    if (minRaw !== '' && (isNaN(minInt!) || String(minInt) !== minRaw)) {
      setPriceError(l.errorPriceMinMaxInt);
      return;
    }
    if (maxRaw !== '' && (isNaN(maxInt!) || String(maxInt) !== maxRaw)) {
      setPriceError(l.errorPriceMinMaxInt);
      return;
    }
    if (minInt !== null && maxInt !== null && minInt > maxInt) {
      setPriceError(l.errorPriceMinMaxMismatch);
      return;
    }
    setPriceError(null);

    setPage(1);

    setAppliedFilters(prev => ({
      ...prev, // сохраняем categoryId — он управляется отдельно
      minPrice: minInt != null ? minInt / displayMultiplier : undefined,
      maxPrice: maxInt != null ? maxInt / displayMultiplier : undefined,
      lat: draftFilters.location?.lat,
      lon: draftFilters.location?.lon,
      radiusKm: draftFilters.location?.radiusKm,
    }));

    console.log('Фильтры применены');
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    setPage(1);

    if (value !== '') {
      console.log(`Поиск по '${value}' выполнен`);
    }
  };

  const handleSorting = (value: SortingAdsType) => {
    setSortBy(value);

    setPage(1);

    console.log(`Сортировка по критерию ${value} выполнена`);
  };

  const handleCategory = (value: CategoryType | null) => {
    setDraftFilters(prev => ({ ...prev, category: value }));
    setAppliedFilters(prev => ({
      ...prev,
      categoryId: value?.id.toString(),
    }));
    setPage(1);
  };

  const handleTag = (value: ProductType | null) => {
    const nextValue = selectedTag === value ? null : value;
    setSelectedTag(nextValue);

    if (nextValue) console.log(`Тег выбран ${value}`);
  };

  const handleLocationConfirm = (
    lat: number,
    lon: number,
    radiusKm: number,
  ) => {
    setLocationMode('custom');
    setDraftFilters(prev => ({
      ...prev,
      location: { lat, lon, radiusKm },
    }));

    console.log(
      `Геофильтр (custom): lat=${lat}, lon=${lon}, radius=${radiusKm} км`,
    );
  };

  const handleLocationNone = () => {
    setLocationMode('none');
    setDraftFilters(prev => ({ ...prev, location: null }));
    setAppliedFilters(prev => ({
      ...prev,
      lat: undefined,
      lon: undefined,
      radiusKm: undefined,
    }));
    setPage(1);
    console.log('Геофильтр: везде');
  };
  const handleLocationCity = () => {
    const coords = cityCoordinates[currentCity];
    if (!coords) return;
    setLocationMode('city');
    setDraftFilters(prev => ({
      ...prev,
      location: {
        lat: coords.lat,
        lon: coords.lon,
        radiusKm: DEFAULT_CITY_RADIUS_KM,
      },
    }));
    console.log(
      `Геофильтр (город): ${currentCity}, lat=${coords.lat}, lon=${coords.lon}`,
    );
  };
  useEffect(() => {
    setDraftFilters({
      category: null,
      minPriceText: '',
      maxPriceText: '',
      location: null,
    });

    setAppliedFilters({});
    setPriceError(null);
    setPage(1);
    setLocationMode('none');
  }, [selectedTag]);

  if (isLoading && allAds.length === 0) {
    return (
      <ScreenContainer>
        <ActivityIndicator />
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
    <ScreenContainer className={'px-4 gap-4'}>
      {/*<View className={'sticky w-full gap-4'} style={{ flex: 1 }}> НЕ РАБОТАЕТ*/}

      <View className={'w-full items-center gap-1'}>
        <SearchBar
          value={search}
          onChangeText={handleSearch}
          placeholder={l.searchFor}
        />
        <CustomText
          className={'text-14'}
          style={{ color: colors.theme.blue.bright }}
        >
          {l.adsFound}: {total}
        </CustomText>
      </View>

      <FlatList
        data={ads}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <SmallAd width={SMALL_AD_WIDTH} ad={item} />}
        numColumns={numColumns}
        columnWrapperStyle={{
          columnGap: 20,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        ListHeaderComponentStyle={{
          zIndex: 10,
        }}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        // пагинация
        onEndReached={() => {
          if (ads.length < total && !isFetching) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (isFetching ? <ActivityIndicator /> : null)}
        ListHeaderComponent={
          <View className={'gap-4 items-center pb-4'} style={{ zIndex: 10 }}>
            <View className={'flex-row justify-between w-full items-center'}>

              <SortingMenu<SortingAdsType>
                items={[
                  {
                    label: l.byNew,
                    value: 'new',
                  },
                  {
                    label: l.byOld,
                    value: 'old',
                  },
                  {
                    label: l.byCheap,
                    value: 'cheap',
                  },
                  {
                    label: l.byExpensive,
                    value: 'expensive',
                  },
                  {
                    label: l.byPopular,
                    value: 'popular',
                  },
                  {
                    label: l.byHighRating,
                    value: 'highRating',
                  },
                  {
                    label: l.byLowRating,
                    value: 'lowRating',
                  },
                ]}
                value={sortBy}
                width={screenWidth * 0.45}
                maxWidth={220}
                onSelect={handleSorting}
              />

              <TouchableOpacity
                style={{
                  opacity: selectedTag == null ? 0.4 : 1,
                  backgroundColor: colors.base.orange.primary,
                  borderWidth: 1,
                  borderColor: colors.base.neutral.blackPrimary,
                  width: screenWidth * 0.45,
                  maxWidth: 240,
                }}
                className={'gap-2 rounded-xl py-2 px-2'}
                disabled={selectedTag == null}
                onPress={() => setCategoryModalVisible(true)}
              >
                <CustomText
                  className={'text-16 font-medium flex-1 text-center'}
                  style={{ color: colors.base.neutral.whiteBright }}
                  numberOfLines={2}
                >
                  {draftFilters.category
                    ? ((l[
                        draftFilters.category.name as keyof typeof l
                      ] as string) ?? draftFilters.category.name)
                    : l.category}
                </CustomText>
              </TouchableOpacity>
            </View>

            <View className={'flex-row gap-4'}>
              <Tag
                label={l.products}
                selected={selectedTag === 'product'}
                onPress={() => handleTag('product')}
              />

              <Tag
                label={l.services}
                selected={selectedTag === 'service'}
                onPress={() => handleTag('service')}
              />

              <Tag
                label={l.spaces}
                selected={selectedTag === 'space'}
                onPress={() => handleTag('space')}
              />
            </View>

            <View className={'gap-1 w-full'}>
              <View className={'flex-row gap-3 mb-4'}>
                <View className={'flex-1'}>
                  <View className={'flex-1 gap-1'}>
                    <CustomText
                      className={'text-19 self-center'}
                      style={{ color: colors.theme.blue.primary }}
                    >
                      {l.priceRange}
                    </CustomText>
                    <CustomInput
                      isSmall
                      value={draftFilters.minPriceText}
                      onChangeText={text => {
                        setDraftFilters(prev => ({
                          ...prev,
                          minPriceText: text,
                        }));

                        setPriceError(null);
                      }}
                      keyboardType={'number-pad'}
                      placeholder={`${l.from}, ${priceUnit}`}
                    />
                  </View>
                  <View className={'flex-1'}>
                    <CustomInput
                      isSmall
                      value={draftFilters.maxPriceText}
                      onChangeText={text => {
                        setDraftFilters(prev => ({
                          ...prev,
                          maxPriceText: text,
                        }));

                        setPriceError(null);
                      }}
                      keyboardType={'number-pad'}
                      placeholder={`${l.to}, ${priceUnit}`}
                    />
                  </View>
                </View>

                {/* Геофильтр. none = везде, city = по городу из Redux, custom = точка на карте */}
                <View className={'flex-1 gap-1'}>
                  <CustomText
                    className={'text-19 self-center'}
                    style={{ color: colors.theme.blue.primary }}
                  >
                    {l.geolocation}
                  </CustomText>
                  <CustomButton
                    isSmall
                    type={locationMode === 'none' ? 'primary' : 'secondary'}
                    text={l.everywhere}
                    onPress={handleLocationNone}
                  />

                  <CustomButton
                    isSmall
                    type={locationMode === 'city' ? 'primary' : 'secondary'}
                    text={
                      (l[currentCity as keyof typeof l] as string) ??
                      currentCity
                    }
                    onPress={handleLocationCity}
                  />

                  <CustomButton
                    isSmall
                    text={l.btnMark}
                    type={locationMode === 'custom' ? 'primary' : 'secondary'}
                    iconSource={icons.mapMarker}
                    iconSize={18}
                    onPress={() => setMapVisible(true)}
                  />
                </View>
              </View>

              {priceError && (
                <CustomText className={'text-14 text-red-500 self-center'}>
                  {priceError}
                </CustomText>
              )}

              <View className={'px-16'}>
                <CustomButton
                  type={'highlighted'}
                  textClassName={'text-18'}
                  text={l.btnApply}
                  onPress={handleApplyFilters}
                />
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={() => (
          <CustomText
            highlight
            className={'text-28 text-center'}
            style={{
              color: colors.theme.blue.primary,
            }}
          >
            {l.emptyAdList}
          </CustomText>
        )}
      />

      <MapPointModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        onConfirm={handleLocationConfirm}
        initialLat={draftFilters.location?.lat}
        initialLon={draftFilters.location?.lon}
        initialRadius={draftFilters.location?.radiusKm}
      />

      {categories && (
        <CategoryModal
          visible={categoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}
          onSelect={handleCategory}
          categories={categories}
          // [ИЗМЕНЕНО] фильтруем по slug ('rent' и т.д.), не по selectedTag ('product')
          productTypeFilter={categorySlug}
          selected={draftFilters.category}
        />
      )}
    </ScreenContainer>
  );
}
