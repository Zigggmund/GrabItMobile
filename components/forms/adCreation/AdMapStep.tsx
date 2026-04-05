import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { YandexMap, Marker } from 'react-native-yamap';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

import { MapService } from '@/services/api/services/mapService';

export const AdMapStep = ({ errors }: { errors: Record<string, string> }) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
  const [coords, setCoords] = useState<[number, number] | null>(
    form.adCreationFormData.latitude && form.adCreationFormData.longitude
      ? [form.adCreationFormData.latitude, form.adCreationFormData.longitude]
      : null
  );

  // Обновление адреса по координатам
  useEffect(() => {
    if (!coords) return;

    const fetchAddress = async () => {
      try {
        const addr = await MapService.getAddress(coords[0], coords[1]);
        form.changeAdCreationFormData('address', addr);
      } catch (err) {
        console.error(err);
        form.changeAdCreationFormData('address', '');
      }
    };

    fetchAddress();
  }, [coords]);

  // Обновление координат в форме при клике на карте
  const onMapPress = (event: { lat: number; lon: number }) => {
    const { lat, lon } = event;
    setCoords([lat, lon]);
    form.changeAdCreationFormData('latitude', lat);
    form.changeAdCreationFormData('longitude', lon);
  };

  return (
    <View className="gap-2">
      <View className="flex-1" style={{ height: 400 }}>
        <YandexMap
          style={{ width: '100%', flex: 1 }}
          onPress={onMapPress}
          initialRegion={{
            lat: coords?.[0] || 55.751244,
            lon: coords?.[1] || 37.618423,
            zoom: 10,
          }}
        >
          {coords && (
            <Marker
              point={{ lat: coords[0], lon: coords[1] }}
              source={require('@/assets/marker.png')} // можно кастомный маркер
            />
          )}
        </YandexMap>
      </View>

      <CustomInput
        label={l.address}
        placeholder={l.addressWillAppearHere}
        value={form.adCreationFormData.address || ''}
        errorMessage={errors.address}
        disable
      />

      {coords && (
        <CustomText
          className="text-14"
          style={{ color: colors.theme.blue.bright }}
        >
          {l.coordinates}: {coords[0]}, {coords[1]}
        </CustomText>
      )}
    </View>
  );
};