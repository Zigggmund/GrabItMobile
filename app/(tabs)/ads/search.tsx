import { useEffect, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';

import SearchBar from '@/components/common/bars/SearchBar';
import { SortingMenu } from '@/components/common/SortingMenu';
import { Tag } from '@/components/common/Tag';
import SmallAd from '@/components/items/ads/SmallAd';
import ScreenContainer from '@/components/layout/ScreenContainer';

import { mockAds } from '@/constants/mocks/mockAds';

type SortingType = 'date' | 'cheap' | 'expensive' | 'popular';
type CategoryType =
  | 'transport'
  | 'realEstate'
  | 'electronics'
  | 'tools'
  | 'homeAndLife'
  | 'events'
  | 'sportsAndLeisure'
  | 'healthAndBeauty'
  | 'kids'
  | 'clothing'
  | 'business'
  | 'other'
  | null;

export default function Search() {
  // АДАПТИВНОСТЬ
  const { width } = useWindowDimensions();
  const itemWidth = 170; // ширина SmallAd
  const numColumns = Math.floor(width / itemWidth);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortingType>('date');
  const [category, setCategory] = useState<CategoryType>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { l } = useLanguage();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };
  const handleSearch = (value: string) => {
    setSearch(value);

    if (value != '') {
      console.log(`Поиск по '${value}' выполнен`);
    }
  };
  const handleSorting = (value: SortingType) => {
    setSortBy(value);
    console.log(`Сортировка по критерию ${value} выполнена`);
  };
  const handleCategory = (value: CategoryType) => {
    setCategory(value);
    console.log(`Категория ${value} выбрана`);
  };

  useEffect(() => {
    console.log('Выбранные теги:', selectedTags);
    // Фильтрация
  }, [selectedTags]);

  return (
    <ScreenContainer className={'px-4 gap-4'}>
      {/*<View className={'sticky w-full gap-4'} style={{ flex: 1 }}> НЕ РАБОТАЕТ*/}
      <SearchBar
        value={search}
        onChangeText={handleSearch}
        placeholder={l.searchFor}
      />

      <View className={'gap-2 items-center'}>
        <View className={'flex-row justify-between w-full'}>
          <SortingMenu<SortingType>
            items={[
              { label: l.byDate, value: 'date' },
              { label: l.byCheap, value: 'cheap' },
              { label: l.byExpensive, value: 'expensive' },
              { label: l.byPopular, value: 'popular' },
            ]}
            value={sortBy}
            onSelect={v => {
              if (v !== null) {
                handleSorting(v);
              }
            }}
          />
          <SortingMenu<CategoryType>
            items={[
              { label: l.noCategory, value: null },
              { label: l.categoryTransport, value: 'transport' },
              { label: l.categoryRealEstate, value: 'realEstate' },
              { label: l.categoryElectronics, value: 'electronics' },
              { label: l.categoryTools, value: 'tools' },
              { label: l.categoryHomeAndLife, value: 'homeAndLife' },
              { label: l.categoryEvents, value: 'events' },
              { label: l.categorySportsAndLeisure, value: 'sportsAndLeisure' },
              { label: l.categoryHealthAndBeauty, value: 'healthAndBeauty' },
              { label: l.categoryKids, value: 'kids' },
              { label: l.categoryClothing, value: 'clothing' },
              { label: l.categoryBusiness, value: 'business' },
              { label: l.categoryOther, value: 'other' },
            ]}
            value={category}
            onSelect={v => handleCategory(v)}
            width={140}
          />
        </View>
        <View className={'flex-row gap-4'}>
          <Tag
            label={l.products}
            selected={selectedTags.includes('products')}
            onPress={() => toggleTag('products')}
          />
          <Tag
            label={l.services}
            selected={selectedTags.includes('services')}
            onPress={() => toggleTag('services')}
          />
          <Tag
            label={l.spaces}
            selected={selectedTags.includes('spaces')}
            onPress={() => toggleTag('spaces')}
          />
        </View>
      </View>

      <FlatList
        data={mockAds}
        renderItem={({ item }) => <SmallAd width={itemWidth} ad={item} />}
        numColumns={numColumns}
        columnWrapperStyle={{ columnGap: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}
