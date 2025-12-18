import React, { useState } from 'react';
import {
  FlatList,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface MenuItem<T> {
  label: string;
  value: T;
  icon?: ImageSourcePropType;
}

interface InputMenuProps<T> {
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  label: string;
  items: MenuItem<T>[];
  value: string | null;
  placeholder?: string;
  disable?: boolean;
  onSelect: (value: T) => void;
  onClearError?: () => void;
  errorMessage?: string;
}

export function CustomInputMenu<T extends string>({
  inputClassName = '',
  containerClassName = '',
  labelClassName = '',
  label,
  items,
  value,
  placeholder = '',
  disable = false,
  onSelect,
  onClearError,
  errorMessage = '',
}: InputMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const selectedItem = items.find(i => i.value === value);

  // для показа в меню лишь невыбранных опций
  const filteredItems = items.filter(i => i.value !== value);

  return (
    <View className={`flex-col gap-2 w-full  ${containerClassName}`}>
      <CustomText
        style={{ color: colors.theme.blue.dark }}
        highlight
        className={`pl-1 text-15 ${labelClassName}`}
      >
        {label.toUpperCase()}
      </CustomText>

      <TouchableOpacity
        disabled={disable}
        style={{
          backgroundColor: colors.base.grey.bright,
          borderWidth: errorMessage == '' ? 0 : 1,
          borderColor: colors.base.red.primary,
        }}
        className={`gap-2 flex-row items-center justify-between rounded-xl px-6 py-2 ${inputClassName}`}
        onPress={() => {
          setOpen(prev => !prev);

          // Очистить ошибку при открытии меню
          if (errorMessage && onClearError) {
            onClearError();
          }
        }}
      >
        <View className={'gap-2 flex-row py-2'}>
          {selectedItem?.icon && (
            <CustomIcon
              source={selectedItem.icon}
              color={colors.base.neutral.blackPrimary}
              size={25}
            />
          )}

          <CustomText
            className={'text-20'}
            style={{
              color: value
                ? colors.base.neutral.blackPrimary
                : colors.base.neutral.greyDark,
            }}
          >
            {selectedItem?.label ?? placeholder}
          </CustomText>
        </View>
        <CustomIcon
          source={icons.arrowDown}
          color={colors.base.neutral.blackPrimary}
          size={20}
        />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            backgroundColor: colors.base.grey.bright,
            borderWidth: 1,
            borderColor: colors.base.neutral.greyDark,
          }}
          className="absolute top-full left-0 w-full z-50 rounded-xl shadow-xl mt-2 py-2"
        >
          <FlatList
            data={filteredItems}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`gap-2 flex-row items-center py-3 px-6 rounded-lg ${inputClassName}`}
                onPress={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
              >
                {item.icon && (
                  <CustomIcon
                    source={item.icon}
                    color={colors.base.neutral.blackPrimary}
                    size={25}
                  />
                )}
                <CustomText
                  className={'text-20'}
                  style={{ color: colors.base.neutral.blackPrimary }}
                >
                  {item.label}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {errorMessage && (
        <Text className="text-red-500 text-12 mt-1">{errorMessage}</Text>
      )}
    </View>
  );
}

// import React, { useState } from 'react';
// import {
//   FlatList,
//   Pressable,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
//
// interface MenuItem<T> {
//   label: string;
//   value: T;
// }
//
// interface InputMenuProps<T> {
//   items: MenuItem<T>[];
//   selectedValue: T;
//   onSelect: (value: T) => void;
//   title?: string;
// }
//
// export function CustomInputMenu<T extends string>({
//   items,
//   selectedValue,
//   onSelect,
//   title,
// }: InputMenuProps<T>) {
//   const [open, setOpen] = useState(false);
//
//   return (
//     <View style={{ flex: 1 }} className="">
//       {/* Кнопка */}
//       <TouchableOpacity
//         className="p-4 rounded-xl bg-gray-300"
//         onPress={() => setOpen(prev => !prev)}
//       >
//         <Text className="text-base">
//           {items.find(i => i.value === selectedValue)?.label}
//         </Text>
//       </TouchableOpacity>
//
//       {/* Выпадающий список */}
//       {open && (
//         <Pressable
//           onPress={() => setOpen(false)}
//           className="absolute top-16 left-0 w-full"
//         >
//           <View className="bg-white rounded-xl shadow-lg p-2">
//             {title && (
//               <Text className="text-lg font-semibold mb-2">{title}</Text>
//             )}
//
//             <FlatList
//               data={items}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className={`py-3 px-2 rounded-lg ${
//                     item.value === selectedValue ? 'bg-gray-200' : ''
//                   }`}
//                   onPress={() => {
//                     onSelect(item.value);
//                     setOpen(false);
//                   }}
//                 >
//                   <Text className="text-base">{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </Pressable>
//       )}
//     </View>
//   );
// }
