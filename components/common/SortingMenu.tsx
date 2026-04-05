import React, { useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
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
}

interface SortingMenuProps<T> {
  items: MenuItem<T>[];
  value: T;
  onSelect: (value: T) => void;
  containerClassName?: string;
  width?: number;
  maxWidth?: number;
}

export function SortingMenu<T>({
  containerClassName = '',
  items,
  value,
  onSelect,
  width = 200,
  maxWidth = width,
}: SortingMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const selectedItem = items.find(i => i.value === value);

  // для показа в меню лишь невыбранных опций
  const filteredItems = items.filter(i => i.value !== value);

  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const buttonRef = useRef<View>(null);

  return (
    <View className={`flex-col gap-2 ${containerClassName}`}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.base.orange.primary,
          borderWidth: 1,
          borderColor: colors.base.neutral.blackPrimary,
          width: width,
          maxWidth: maxWidth,
        }}
        className={`gap-2 flex-row items-center rounded-xl py-2 px-2 ${containerClassName}`}
        ref={buttonRef}
        onPress={() => {
          buttonRef.current?.measureInWindow((x, y, width, height) => {
            setButtonLayout({ x, y, width, height });
            setOpen(prev => !prev);
          });
        }}
      >
        <CustomText
          className={'text-16 font-medium flex-1 text-center'}
          style={{ color: colors.base.neutral.whiteBright }}
          numberOfLines={2}
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
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setOpen(false)} // закрыть при тапе вне
          >
            <View
              style={{
                position: 'absolute',
                top: buttonLayout.y + buttonLayout.height * 2, // прямо под кнопкой
                left: buttonLayout.x,
                width: buttonLayout.width,
                maxHeight: 300,
                backgroundColor: colors.base.grey.bright,
                borderRadius: 10,
              }}
            >
              <ScrollView
                style={{
                  backgroundColor: colors.base.grey.bright,
                  maxHeight: 200,
                  borderRadius: 10,
                }}
              >
                {filteredItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                    className={`py-3 px-6 rounded-lg ${containerClassName}`}
                  >
                    <CustomText
                      className={'text-16 font-medium text-center'}
                      style={{ color: colors.base.neutral.blackPrimary }}
                    >
                      {item.label}
                    </CustomText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

// import React, { useState } from 'react';
// import { FlatList, TouchableOpacity, View } from 'react-native';
//
// import { useTheme } from '@/hooks/useTheme';
//
// import { CustomIcon } from '@/components/ui/icon/CustomIcon';
// import { CustomText } from '@/components/ui/text/CustomText';
//
// import { icons } from '@/constants/icons';
//
// interface MenuItem<T> {
//   label: string;
//   value: T;
// }
//
// interface SortingMenuProps<T> {
//   items: MenuItem<T>[];
//   value: T;
//   onSelect: (value: T) => void;
//   containerClassName?: string;
//   width?: number;
//   maxWidth?: number;
// }
//
// export function SortingMenu<T>({
//   containerClassName = '',
//   items,
//   value,
//   onSelect,
//   width = 200,
//   maxWidth = width,
// }: SortingMenuProps<T>) {
//   const [open, setOpen] = useState(false);
//   const { colors } = useTheme();
//   const selectedItem = items.find(i => i.value === value);
//
//   // для показа в меню лишь невыбранных опций
//   const filteredItems = items.filter(i => i.value !== value);
//
//   return (
//     <View className={`flex-col gap-2 ${containerClassName}`}>
//       <TouchableOpacity
//         style={{
//           backgroundColor: colors.base.orange.primary,
//           borderWidth: 1,
//           borderColor: colors.base.neutral.blackPrimary,
//           width: width,
//           maxWidth: maxWidth,
//         }}
//         className={`gap-2 flex-row items-center rounded-xl py-2 px-2 ${containerClassName}`}
//         onPress={() => {
//           setOpen(prev => !prev);
//         }}
//       >
//         <CustomText
//           className={'text-16 font-medium flex-1 text-center'}
//           style={{ color: colors.base.neutral.whiteBright }}
//           numberOfLines={2}
//         >
//           {selectedItem?.label}
//         </CustomText>
//         <CustomIcon
//           source={icons.arrowDown}
//           color={colors.base.neutral.whiteBright}
//           size={24}
//         />
//       </TouchableOpacity>
//
//       {open && (
//         <View
//           style={{
//             backgroundColor: colors.base.grey.bright,
//             width: width,
//             borderWidth: 1,
//             borderColor: colors.theme.grey.dark,
//           }}
//           className={`absolute top-full left-0 w-full z-50 rounded-xl shadow-xl mt-2 py-2 ${containerClassName}`}
//         >
//           <FlatList
//             data={filteredItems}
//             keyExtractor={(_, index) => index.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 className={`py-3 px-6 rounded-lg ${containerClassName}`}
//                 onPress={() => {
//                   onSelect(item.value);
//                   setOpen(false);
//                 }}
//               >
//                 <CustomText
//                   className={'text-16 font-medium text-center'}
//                   style={{ color: colors.base.neutral.blackPrimary }}
//                 >
//                   {item.label}
//                 </CustomText>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       )}
//     </View>
//   );
// }
