import { CategoryType } from '@/types/CategoryType';

import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
} from 'react-native';

import { useGetAllAds } from '@/hooks/ad/useGetAllAds';
import { useGetAllCategories } from '@/hooks/category/useGetAllCategories';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import SearchBar from '@/components/common/bars/SearchBar';
import ErrorMessage from '@/components/common/ErrorMessage';
import { SortingMenu } from '@/components/common/SortingMenu';
import { Tag } from '@/components/common/Tag';
import SmallAd from '@/components/items/ads/SmallAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

import { SMALL_AD_WIDTH } from '@/constants/sizes';

// import { mockAds } from '@/constants/mocks/mockAds';

type SortingType =
  | 'new'
  | 'old'
  | 'cheap'
  | 'expensive'
  | 'popular'
  | 'highRating'
  | 'lowRating';

export default function Search() {
  const { l } = useLanguage();
  const { colors } = useTheme();
  // АДАПТИВНОСТЬ
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = Math.floor(screenWidth / SMALL_AD_WIDTH);

  const {
    data: ads = [],
    isLoading: isLoading,
    isError: isError,
  } = useGetAllAds();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryType | null>(null);
  const categories = useGetAllCategories().data;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortingType>('new');
  // const [page, setPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);

    if (value != '') {
      console.log(`Поиск по '${value}' выполнен`);
    }
  };

  // Sorting + data filters +
  const processedAds = useMemo(() => {
    let result = [...ads];

    const stringWithoutSpaces = search.replace(/\s/g, '');
    if (stringWithoutSpaces) {
      result = result.filter(item => item.title.includes(search));
    }

    console.log(selectedTags);
    if (selectedTags.length > 0) {
      result = result.filter(item => selectedTags.includes(item.productType));
    }

    if (category) {
      console.log(category, result[0].categoryId);
      result = result.filter(item => item.categoryId == category.id);
    }

    switch (sortBy) {
      case 'new':
        result.sort(
          (a, b) => +new Date(b.createdDate) - +new Date(a.createdDate),
        );
        break;
      case 'old':
        result.sort(
          (a, b) => +new Date(a.createdDate) - +new Date(b.createdDate),
        );
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'cheap':
        // !!! некорректно будет работать с разными priceUnit
        result.sort((a, b) => a.cost[0].payment - b.cost[0].payment);
        break;
      case 'expensive':
        result.sort((a, b) => b.cost[0].payment - a.cost[0].payment);
        break;
      case 'highRating':
        result.sort((a, b) => {
          if (a.rating == null && b.rating == null) return 0;
          if (a.rating == null) return 1; // a без рейтинга → в конец
          if (b.rating == null) return -1; // b без рейтинга → в конец
          return b.rating - a.rating;
        });
        break;
      case 'lowRating':
        result.sort((a, b) => {
          if (a.rating == null && b.rating == null) return 0;
          if (a.rating == null) return 1; // a без рейтинга → в конец
          if (b.rating == null) return -1; // b без рейтинга → в конец
          return a.rating - b.rating;
        });
        break;
    }

    return result;
  }, [ads, category, sortBy, selectedTags, search]);

  const handleSorting = (value: SortingType) => {
    setSortBy(value);
    if (value) console.log(`Сортировка по критерию ${value} выполнена`);
  };

  const handleCategory = (value: CategoryType | null) => {
    setCategory(value);
    if (value) console.log(`Категория ${value?.name} выбрана`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
    console.log(`Текущие выбранные теги: ${selectedTags}`);
  };

  useEffect(() => {
    console.log('Выбранные теги:', selectedTags);
    // Фильтрация
  }, [selectedTags]);

  if (isLoading)
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

  return (
    <ScreenContainer className={'px-4 gap-4'}>
      {/*<View className={'sticky w-full gap-4'} style={{ flex: 1 }}> НЕ РАБОТАЕТ*/}
      <SearchBar
        value={search}
        onChangeText={handleSearch}
        placeholder={l.searchFor}
      />

      <FlatList
        keyExtractor={item => item.categoryId.toString()}
        data={processedAds}
        renderItem={({ item }) => <SmallAd width={SMALL_AD_WIDTH} ad={item} />}
        numColumns={numColumns}
        columnWrapperStyle={{ columnGap: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponentStyle={{ zIndex: 10 }}
        ListHeaderComponent={() => (
          <View className={'gap-2 items-center pb-4'}>
            <View className={'flex-row justify-between w-full items-center'}>
              <SortingMenu<SortingType>
                items={[
                  { label: l.byNew, value: 'new' },
                  { label: l.byOld, value: 'old' },
                  { label: l.byCheap, value: 'cheap' },
                  { label: l.byExpensive, value: 'expensive' },
                  { label: l.byPopular, value: 'popular' },
                  { label: l.byHighRating, value: 'highRating' },
                  { label: l.byLowRating, value: 'lowRating' },
                ]}
                value={sortBy}
                width={screenWidth * 0.45}
                maxWidth={220}
                onSelect={v => handleSorting(v)}
              />
              {categories && (
                <SortingMenu<CategoryType | null>
                  items={[
                    { label: l.allCategories, value: null },
                    { label: l.transport, value: categories[0] },
                    { label: l.realEstate, value: categories[1] },
                    { label: l.electronics, value: categories[2] },
                    { label: l.tools, value: categories[3] },
                    { label: l.homeAndLife, value: categories[4] },
                    { label: l.events, value: categories[5] },
                    { label: l.sportsAndLeisure, value: categories[6] },
                    { label: l.healthAndBeauty, value: categories[7] },
                    { label: l.kids, value: categories[8] },
                    { label: l.clothing, value: categories[9] },
                    { label: l.business, value: categories[10] },
                    { label: l.other, value: categories[11] },
                  ]}
                  value={category}
                  onSelect={v => handleCategory(v)}
                  width={screenWidth * 0.45}
                  maxWidth={240}
                />
              )}
            </View>
            <View className={'flex-row gap-4'}>
              <Tag
                label={l.products}
                selected={selectedTags.includes('product')}
                onPress={() => toggleTag('product')}
              />
              <Tag
                label={l.services}
                selected={selectedTags.includes('service')}
                onPress={() => toggleTag('service')}
              />
              <Tag
                label={l.spaces}
                selected={selectedTags.includes('space')}
                onPress={() => toggleTag('space')}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <CustomText
            highlight
            className={'text-28 text-center'}
            style={{ color: colors.theme.blue.primary }}
          >
            {l.emptyAdList}
          </CustomText>
        )}
      />
    </ScreenContainer>
  );
}
