import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface MenuItem<T> {
  label: string;
  value: T;
}

interface SortingMenuProps<T> {
  containerClassName?: string;
  items: MenuItem<T>[];
  value: string | null;
  onSelect: (value: T) => void;
  width?: number;
}

export function SortingMenu<T extends string>({
  containerClassName = '',
  items,
  value,
  onSelect,
  width = 200,
}: SortingMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const selectedItem = items.find(i => i.value === value);

  // для показа в меню лишь невыбранных опций
  const filteredItems = items.filter(i => i.value !== value);

  return (
    <View className={`flex-col gap-2 w-full ${containerClassName}`}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.base.orange.primary,
          borderWidth: 1,
          borderColor: colors.base.neutral.blackPrimary,
          width: width,
        }}
        className={`gap-2 flex-row items-center justify-center rounded-xl py-2 ${containerClassName}`}
        onPress={() => {
          setOpen(prev => !prev);
        }}
      >
        <CustomText
          className={'text-16 font-medium'}
          style={{ color: colors.base.neutral.whiteBright }}
        >
          {selectedItem?.label}
        </CustomText>
        <CustomIcon
          source={icons.arrowDown}
          color={colors.base.neutral.whiteBright}
          size={24}
        />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            backgroundColor: colors.base.grey.bright,
            width: width,
            borderWidth: 1,
            borderColor: colors.base.neutral.greyDark,
          }}
          className={`absolute top-full left-0 w-full z-50 rounded-xl shadow-xl mt-2 py-2 ${containerClassName}`}
        >
          <FlatList
            data={filteredItems}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`items-center py-3 px-6 rounded-lg ${containerClassName}`}
                onPress={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
              >
                <CustomText
                  className={'text-16 font-medium'}
                  style={{ color: colors.base.neutral.blackPrimary }}
                >
                  {item.label}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
