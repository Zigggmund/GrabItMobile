import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View } from 'react-native';
import { Marker, YaMap } from 'react-native-yamap';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

import { MapService } from '@/services/api/services/mapService';

export const AdMapStep = ({ errors }: { errors: Record<string, string> }) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
  const [coords, setCoords] = useState<[number, number] | null>(
    form.adCreationFormData.latitude && form.adCreationFormData.longitude
      ? [form.adCreationFormData.latitude, form.adCreationFormData.longitude]
      : null,
  );

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // iOS сама запрашивает
      return true;
    } catch (error) {
      console.error('Ошибка запроса геолокации:', error);
      return false;
    }
  };

  // Получение текущего местоположения пользователя
  useEffect(() => {
    if (!coords) {
      const getPosition = async () => {
        const permission = await requestLocationPermission();
        if (permission) {
          navigator.geolocation.getCurrentPosition(
            pos => {
              const { latitude, longitude } = pos.coords;
              setCoords([latitude, longitude]);
              form.changeAdCreationFormData('latitude', latitude);
              form.changeAdCreationFormData('longitude', longitude);
            },
            err => console.error(err),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
      };
      getPosition();
    }
  }, []);

  // Обновление адреса при смене координат
  useEffect(() => {
    if (!coords) return;

    const fetchAddress = async () => {
      try {
        const addr = await MapService.getAddress(coords[0], coords[1]);
        form.changeAdCreationFormData('address', addr);
      } catch {
        form.changeAdCreationFormData('address', '');
      }
    };

    fetchAddress();
  }, [coords]);

  // const onMapPress = (e: {
  //   nativeEvent: { coordinate: { latitude: number; longitude: number } };
  // }) => {
  //   const { latitude, longitude } = e.nativeEvent.coordinate;
  //   setCoords([latitude, longitude]);
  //   form.changeAdCreationFormData('latitude', latitude);
  //   form.changeAdCreationFormData('longitude', longitude);
  // };

  return (
    <View className="gap-2">
      <View className="flex-1" style={{ height: 400 }}>
        <YaMap
          style={{ width: '100%', flex: 1 }}
          initialRegion={{
            lat: coords?.[0] || 55.751244,
            lon: coords?.[1] || 37.618423,
            zoom: 10,
          }}
          onMapPress={e => {
            // e.nativeEvent.lat / e.nativeEvent.lon
            const { lat, lon } = e.nativeEvent;
            setCoords([lat, lon]);
            form.changeAdCreationFormData('latitude', lat);
            form.changeAdCreationFormData('longitude', lon);
          }}
        >
          {coords && (
            <Marker
              point={{ lat: coords[0], lon: coords[1] }}
              source={icons.mapMarker} // кастомный маркер
            />
          )}
        </YaMap>
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
