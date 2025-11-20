import { useState } from 'react';
import { Pressable } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { saveCity } from '@/state/city/citySlice';
import { useCustomDispatch, useCustomSelector } from '@/state/hoooks';

import CityModal from '@/components/modals/CityModal';
import { CustomText } from '@/components/ui/text/CustomText';

export default function CitySelector() {
  const { l } = useLanguage();
  const { colors } = useTheme();

  const dispatch = useCustomDispatch();
  const currentCity = useCustomSelector(state => state.city.currentCity);
  const cityKeys = useCustomSelector(state => state.city.cities);

  const [visible, setVisible] = useState(false);

  const handleSelect = (key: string) => {
    dispatch(saveCity(key));
    setVisible(false);
  };

  return (
    <>
      <Pressable className="flex-row gap-1" onPress={() => setVisible(true)}>
        <CustomText
          style={{ color: colors.theme.blue.bright }}
          className={'text-18 align-middle'}
        >
          {l.city}:
        </CustomText>
        <CustomText
          highlight
          style={{ color: colors.theme.blue.dark }}
          className={'underline font-bold text-18 align-middle'}
        >
          {l[currentCity]}
        </CustomText>
      </Pressable>

      <CityModal
        visible={visible}
        onClose={() => setVisible(false)}
        cities={cityKeys}
        onSelect={handleSelect}
        currentCity={currentCity}
      />
    </>
  );
}

// import { useState } from 'react';
// import { View } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
//
// import { useLanguage } from '@/hooks/useLanguage';
// import { useTheme } from '@/hooks/useTheme';
//
// import { saveCity } from '@/state/city/citySlice';
// import { useCustomDispatch, useCustomSelector } from '@/state/hoooks';
//
// import { CustomText } from '@/components/ui/text/CustomText';
//
// import { CityKey } from '@/constants/cities';
//
// export default function CitySelector() {
//   const { l } = useLanguage();
//   const { colors } = useTheme();
//
//   const currentCity = useCustomSelector(s => s.city.currentCity);
//   const cityKeys = useCustomSelector(s => s.city.cities);
//   const dispatch = useCustomDispatch();
//
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState(currentCity);
//
//   const items = cityKeys.map((key: CityKey) => ({
//     label: l[key],
//     value: key,
//   }));
//
//   const handleChange = (key: string | null) => {
//     if (key) {
//       setValue(key);
//       dispatch(saveCity(key as CityKey));
//     }
//   };
//
//   return (
//     <View className={'flex-row gap-1'}>
//       <CustomText
//         className={'text-17'}
//         style={{ color: colors.theme.blue.bright }}
//       >
//         {l.city}:
//       </CustomText>
//       <DropDownPicker
//         open={open}
//         value={value}
//         items={items}
//         setOpen={setOpen}
//         setValue={setValue}
//         onChangeValue={handleChange}
//         style={{ borderColor: '#ccc', minWidth: 160 }}
//         dropDownContainerStyle={{ borderColor: '#ccc', minWidth: 160 }}
//       />
//     </View>
//   );
// }
