import { useEffect, useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';

import SearchBar from '@/components/common/SearchBar';
import { SortingMenu } from '@/components/common/SortingMenu';
import { Tag } from '@/components/common/Tag';
import SmallAd from '@/components/items/SmallAd';
import ScreenContainer from '@/components/layout/ScreenContainer';

import { mockAds } from '@/constants/mocks/mockAds';

type sortingType = 'date' | 'cheap' | 'expensive' | 'popular';

export default function Search() {
  // АДАПТИВНОСТЬ
  const { width } = useWindowDimensions();
  const itemWidth = 170; // ширина SmallAd
  const numColumns = Math.floor(width / itemWidth);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<sortingType>('date');
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
  const handleSorting = (value: sortingType) => {
    setSortBy(value);
    console.log(`Сортировка по критерию ${value} выполнена`);
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
        <SortingMenu
          items={[
            { label: l.byDate, value: 'date' },
            { label: l.byCheap, value: 'cheap' },
            { label: l.byExpensive, value: 'expensive' },
            { label: l.byPopular, value: 'popular' },
          ]}
          value={sortBy}
          onSelect={v => handleSorting(v)}
        />
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
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
      />
      {/*</View>*/}

      {/* ТЕСТ ВСЕХ ШРИФТОВ */}
      {/*<View className={'justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30'}*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30'}*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-medium'}*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-medium'}*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-bold'}*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-bold'}*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30'}*/}
      {/*    highlight*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30'}*/}
      {/*    highlight*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-medium'}*/}
      {/*    highlight*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-medium'}*/}
      {/*    highlight*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}
      {/*<View className={'justify-between flex-row'}>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-bold'}*/}
      {/*    highlight*/}
      {/*  >*/}
      {/*    Hello there*/}
      {/*  </CustomText>*/}
      {/*  <CustomText*/}
      {/*    style={{ color: colors.theme.blue.dark }}*/}
      {/*    className={'text-30 font-bold'}*/}
      {/*    highlight*/}
      {/*  >*/}
      {/*    Привет всем*/}
      {/*  </CustomText>*/}
      {/*</View>*/}

      {/*ТЕСТ НАСТРОЕК*/}
      {/*<CustomButton text={l.dark} onPress={() => setTheme('dark')} />*/}
      {/*<CustomButton text={l.light} onPress={() => setTheme('light')} />*/}
      {/*<CustomButton text={l.english} onPress={() => setLanguage('en')} />*/}
      {/*<CustomButton text={l.russian} onPress={() => setLanguage('ru')} />*/}
    </ScreenContainer>
  );
}
