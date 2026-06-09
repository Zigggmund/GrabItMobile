import React, { useMemo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feature, Point } from 'geojson';

import { CategoryType } from '@/types/entities/CategoryType';
import { AdPreviewType } from '@/types/entities/AdType';

import { useSearchAds } from '@/hooks/ad/useSearchAds';
import { useGetProductTypeCategories } from '@/hooks/category/useGetProductTypeCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import SearchBar from '@/components/common/bars/SearchBar';
import RatingStars from '@/components/common/RatingStars';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

import { cityCoordinates, DEFAULT_CITY_RADIUS_KM } from '@/constants/cityCoordinates';
import { icons } from '@/constants/icons';
import { RootState } from '@/state/store';

const EMPTY_MAP_STYLE = { version: 8 as const, sources: {}, layers: [] };

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
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lon?: number;
  radiusKm?: number;
}

export default function AdMapSearchPage() {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();
  const insets = useSafeAreaInsets();

  const currentCity = useSelector((state: RootState) => state.city.currentCity);
  const cityCoords = cityCoordinates[currentCity];
  const cameraCenter: [number, number] = [cityCoords.lon, cityCoords.lat];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [locationMode, setLocationMode] = useState<'none' | 'city' | 'custom'>('city');
  const [priceError, setPriceError] = useState<string | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 600);
  const [radiusText, setRadiusText] = useState(String(DEFAULT_CITY_RADIUS_KM));

  const [draftFilters, setDraftFilters] = useState<DraftFilters>({
    category: null,
    minPriceText: '',
    maxPriceText: '',
    location: cityCoords
      ? { lat: cityCoords.lat, lon: cityCoords.lon, radiusKm: DEFAULT_CITY_RADIUS_KM }
      : null,
  });

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(
    cityCoords
      ? { lat: cityCoords.lat, lon: cityCoords.lon, radiusKm: DEFAULT_CITY_RADIUS_KM }
      : {},
  );

  const categories = useGetProductTypeCategories('product').data;

  const { data, isFetching } = useSearchAds({
    query: debouncedSearch || undefined,
    sort_by: 'new',
    page: 1,
    pageSize: 200,
    categoryId: appliedFilters.categoryId,
    minPrice: appliedFilters.minPrice,
    maxPrice: appliedFilters.maxPrice,
    lat: appliedFilters.lat,
    lon: appliedFilters.lon,
    radiusKm: appliedFilters.radiusKm,
  });

  const ads: AdPreviewType[] = useMemo(
    () => (data?.items ?? []).filter(ad => ad.lat != null && ad.lon != null),
    [data],
  );

  const total = data?.total ?? 0;
  const selectedAd = ads.find(ad => ad.id === selectedId) ?? null;

  const allPinsGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: ads.map(ad => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [ad.lon!, ad.lat!] },
        properties: { id: ad.id },
      })),
    }),
    [ads],
  );

  const selectedGeoJSON = useMemo(() => {
    if (!selectedAd) return null;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [selectedAd.lon!, selectedAd.lat!],
      },
      properties: { id: selectedAd.id },
    };
  }, [selectedAd]);

  const searchCenterGeoJSON = useMemo(() => {
    if (!draftFilters.location || locationMode === 'none') return null;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [draftFilters.location.lon, draftFilters.location.lat],
      },
      properties: {},
    };
  }, [draftFilters.location, locationMode]);

  const parseRadius = (): number => {
    const r = parseFloat(radiusText.replace(',', '.'));
    return isNaN(r) || r <= 0 ? DEFAULT_CITY_RADIUS_KM : r;
  };

  const handlePinPress: React.ComponentProps<typeof MapLibreGL.ShapeSource>['onPress'] = e => {
    const id = e.features?.[0]?.properties?.id as string | undefined;
    if (id) setSelectedId(prev => (prev === id ? null : id));
  };

  const handleMapPress = (e: Feature) => {
    const geom = e.geometry;
    if (geom?.type === 'Point') {
      const [lon, lat] = (geom as Point).coordinates;
      const radius = parseRadius();
      setLocationMode('custom');
      setSelectedId(null);
      setDraftFilters(prev => ({ ...prev, location: { lat, lon, radiusKm: radius } }));
    }
  };

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
    setAppliedFilters(prev => ({
      ...prev,
      minPrice: minInt ?? undefined,
      maxPrice: maxInt ?? undefined,
      lat: draftFilters.location?.lat,
      lon: draftFilters.location?.lon,
      radiusKm: draftFilters.location?.radiusKm,
    }));
  };

  const handleCategory = (value: CategoryType | null) => {
    setDraftFilters(prev => ({ ...prev, category: value }));
    setAppliedFilters(prev => ({ ...prev, categoryId: value?.id.toString() }));
  };

  const handleLocationNone = () => {
    setLocationMode('none');
    setDraftFilters(prev => ({ ...prev, location: null }));
    setAppliedFilters(prev => ({ ...prev, lat: undefined, lon: undefined, radiusKm: undefined }));
  };

  const handleLocationCity = () => {
    if (!cityCoords) return;
    setLocationMode('city');
    const radius = parseRadius();
    const loc = { lat: cityCoords.lat, lon: cityCoords.lon, radiusKm: radius };
    setDraftFilters(prev => ({ ...prev, location: loc }));
    setAppliedFilters(prev => ({ ...prev, ...loc }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.theme.white.primary }}>

      {/* ── Filter panel ── */}
      <View
        style={{
          paddingTop: 18,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: colors.theme.white.primary,
          borderBottomWidth: 1,
          borderBottomColor: colors.components.card.rent.border,
          zIndex: 10,
          elevation: 10,
          gap: 8,
        }}
      >
        {/* Search bar + count — always visible */}
        <View className="w-full items-center gap-1">
          <View className="flex-row gap-3 justify-center mb-2">
            <CustomButton
              text={l.viewList}
              type="secondary"
              onPress={() => navigate('/(tabs)/ads/search', false)}
            />
            <CustomButton
              text={l.viewMap}
              type="highlighted"
              onPress={() => {}}
            />
          </View>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={l.searchFor}
          />
          <CustomText className="text-14" style={{ color: colors.theme.blue.bright }}>
            {l.adsFound}: {total}
          </CustomText>
        </View>

        {/* Collapsible filters */}
        {panelExpanded && (
          <View className="gap-4">
            {/* Category */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.base.orange.primary,
                borderWidth: 1,
                borderColor: colors.base.neutral.blackPrimary,
              }}
              className="rounded-xl py-2 px-2"
              onPress={() => setCategoryModalVisible(true)}
            >
              <CustomText
                className="text-16 font-medium flex-1 text-center"
                style={{ color: colors.base.neutral.whiteBright }}
                numberOfLines={2}
              >
                {draftFilters.category
                  ? ((l[draftFilters.category.name as keyof typeof l] as string) ??
                      draftFilters.category.name)
                  : l.category}
              </CustomText>
            </TouchableOpacity>

            {/* Price + Geo — two columns like search.tsx */}
            <View className="gap-1 w-full">
              <View className="flex-row gap-3">
                {/* Price column */}
                <View className="flex-1 gap-1">
                  <CustomText
                    className="text-19 self-center"
                    style={{ color: colors.theme.blue.primary }}
                  >
                    {l.priceRange}
                  </CustomText>
                  <CustomInput
                    isSmall
                    value={draftFilters.minPriceText}
                    onChangeText={text => {
                      setDraftFilters(prev => ({ ...prev, minPriceText: text }));
                      setPriceError(null);
                    }}
                    keyboardType="number-pad"
                    placeholder={`${l.from}, ${l.rubPerHour}`}
                  />
                  <CustomInput
                    isSmall
                    value={draftFilters.maxPriceText}
                    onChangeText={text => {
                      setDraftFilters(prev => ({ ...prev, maxPriceText: text }));
                      setPriceError(null);
                    }}
                    keyboardType="number-pad"
                    placeholder={`${l.to}, ${l.rubPerHour}`}
                  />
                  <CustomInput
                    isSmall
                    value={radiusText}
                    onChangeText={setRadiusText}
                    keyboardType="numeric"
                    placeholder={l.searchRadius}
                  />
                </View>

                {/* Geo column */}
                <View className="flex-1 gap-1">
                  <CustomText
                    className="text-19 self-center"
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
                    text={(l[currentCity as keyof typeof l] as string) ?? currentCity}
                    onPress={handleLocationCity}
                  />
                  <CustomButton
                    isSmall
                    type={locationMode === 'custom' ? 'primary' : 'secondary'}
                    text={l.btnMark}
                    iconSource={icons.mapMarker}
                    iconSize={18}
                    onPress={() => setLocationMode('custom')}
                  />
                </View>
              </View>

              {priceError && (
                <CustomText className="text-14 text-red-500 self-center">
                  {priceError}
                </CustomText>
              )}

              <View className="px-16">
                <CustomButton
                  type="highlighted"
                  textClassName="text-18"
                  text={l.btnApply}
                  onPress={handleApplyFilters}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── Collapse toggle (half-circle protruding below panel) ── */}
      <View style={{ alignItems: 'center', height: 0, zIndex: 20, elevation: 20 }}>
        <TouchableOpacity
          onPress={() => setPanelExpanded(v => !v)}
          style={{
            width: 56,
            height: 28,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            backgroundColor: colors.theme.white.primary,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: colors.components.card.rent.border,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 20,
          }}
        >
          <CustomText
            style={{ fontSize: 12, lineHeight: 14, color: colors.theme.blue.primary }}
          >
            {panelExpanded ? '▲' : '▼'}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* ── Map ── */}
      <View style={{ flex: 1 }}>
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          mapStyle={EMPTY_MAP_STYLE}
          onPress={handleMapPress}
        >
          <MapLibreGL.Camera zoomLevel={11} centerCoordinate={cameraCenter} />

          <MapLibreGL.RasterSource
            id="osmSource"
            tileUrlTemplates={['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png']}
            tileSize={256}
          >
            <MapLibreGL.RasterLayer id="osmLayer" />
          </MapLibreGL.RasterSource>

          {searchCenterGeoJSON && (
            <MapLibreGL.ShapeSource id="searchCenter" shape={searchCenterGeoJSON}>
              <MapLibreGL.CircleLayer
                id="searchCenterLayer"
                style={{
                  circleRadius: 8,
                  circleColor: colors.theme.blue.bright,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                  circleOpacity: 0.6,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}

          {ads.length > 0 && (
            <MapLibreGL.ShapeSource
              id="allPins"
              shape={allPinsGeoJSON}
              onPress={handlePinPress}
            >
              <MapLibreGL.CircleLayer
                id="allPinsLayer"
                style={{
                  circleRadius: 10,
                  circleColor: colors.base.orange.primary,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />
            </MapLibreGL.ShapeSource>
          )}

          {selectedGeoJSON && (
            <MapLibreGL.ShapeSource id="selectedPin" shape={selectedGeoJSON}>
              <MapLibreGL.CircleLayer
                id="selectedPinLayer"
                style={{
                  circleRadius: 14,
                  circleColor: colors.theme.blue.primary,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF',
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>

        {isFetching && (
          <ActivityIndicator
            style={{ position: 'absolute', top: 16, alignSelf: 'center' }}
            color={colors.base.orange.primary}
          />
        )}

        {selectedAd && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigate({
                pathname: '/(tabs)/ads/[id]',
                params: { id: selectedAd.id },
              })
            }
            style={{
              position: 'absolute',
              bottom: 24,
              left: 16,
              right: 16,
              backgroundColor: colors.theme.white.primary,
              borderRadius: 16,
              padding: 16,
              gap: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
              borderWidth: 1,
              borderColor: colors.components.card.rent.border,
            }}
          >
            <CustomText
              highlight
              numberOfLines={1}
              className="text-16 font-bold"
              style={{ color: colors.theme.blue.primary }}
            >
              {selectedAd.title}
            </CustomText>
            <RatingStars rating={selectedAd.rating} size="small" />
            <CustomText
              className="text-14 font-bold"
              style={{ color: colors.theme.blue.dark }}
            >
              {selectedAd.rub_per_hour} {l.rubPerHour}
            </CustomText>
            <CustomText
              numberOfLines={1}
              className="text-12"
              style={{ color: colors.theme.blue.bright }}
            >
              {selectedAd.address}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {categories && (
        <CategoryModal
          visible={categoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}
          onSelect={handleCategory}
          categories={categories}
          productTypeFilter="product"
          selected={draftFilters.category}
        />
      )}
    </View>
  );
}
