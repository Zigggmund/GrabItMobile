import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, ScrollView, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feature, Point } from 'geojson';

const EMPTY_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [],
};

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
        if (!permission) return;

        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            setCoords([latitude, longitude]);
            form.changeAdCreationFormData('latitude', latitude);
            form.changeAdCreationFormData('longitude', longitude);
          },
          err => console.error(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
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
    <ScrollView>
      <View className="gap-2">
        <MapLibreGL.MapView
          style={{ height: 300, width: '100%' }}
          mapStyle={EMPTY_MAP_STYLE}
          onPress={(e: Feature) => {
            const geom = e.geometry;

            // Проверяем, что это Point
            if (geom && geom.type === 'Point') {
              const point = geom as Point; // явно говорим TS, что это Point
              const coordsArr = point.coordinates; // теперь coordinates доступны
              if (coordsArr.length >= 2) {
                const [lon, lat] = coordsArr;
                if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                  setCoords([lat, lon]);
                  form.changeAdCreationFormData('latitude', lat);
                  form.changeAdCreationFormData('longitude', lon);
                } else {
                  console.warn('Invalid coordinates:', lat, lon);
                }
              }
            }
          }}
        >
          <MapLibreGL.Camera
            zoomLevel={12}
            centerCoordinate={
              coords ? [coords[1], coords[0]] : [37.618423, 55.751244]
            }
          />

          <MapLibreGL.RasterSource
            id="osmSource"
            tileUrlTemplates={[
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ]}
            tileSize={256}
            // id="osmSource"
            // tileUrlTemplates={[
            //   'https://demotiles.maplibre.org/tiles/bright/{z}/{x}/{y}.png',
            // ]}
            // tileSize={256}
          >
            <MapLibreGL.RasterLayer id="osmLayer" />
          </MapLibreGL.RasterSource>

          {coords && (
            <MapLibreGL.ShapeSource
              id="markerSource"
              shape={{
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [coords[1], coords[0]] },
                properties: {},
              }}
            >
              <MapLibreGL.CircleLayer
                id="markerCircle"
                style={{
                  circleRadius: 10,
                  circleColor: colors.base.orange.primary,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#ffffff',
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>

        {/*<MapLibreGL.MapView*/}
        {/*  style={{ height: 300, width: '100%' }}*/}
        {/*  // style={{ flex: 1 }}*/}
        {/*  onPress={(feature: Feature<Geometry, GeoJsonProperties>) => {*/}
        {/*    if (feature.geometry?.type === 'Point') {*/}
        {/*      const coordsArr = feature.geometry.coordinates; // coordsArr: Position = number[]*/}

        {/*      // Безопасно извлекаем первые два числа*/}
        {/*      if (coordsArr.length >= 2) {*/}
        {/*        const [lon, lat] = coordsArr;*/}
        {/*        setCoords([lat, lon]);*/}
        {/*        form.changeAdCreationFormData('latitude', lat);*/}
        {/*        form.changeAdCreationFormData('longitude', lon);*/}
        {/*      }*/}
        {/*    }*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <MapLibreGL.Camera*/}
        {/*    zoomLevel={12}*/}
        {/*    centerCoordinate={*/}
        {/*      coords ? [coords[1], coords[0]] : [37.618423, 55.751244]*/}
        {/*    }*/}
        {/*  />*/}

        {/*  <MapLibreGL.RasterSource*/}
        {/*    id="osm"*/}
        {/*    tileUrlTemplates={[*/}
        {/*      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',*/}
        {/*    ]}*/}
        {/*    tileSize={256}*/}
        {/*  >*/}
        {/*    <MapLibreGL.RasterLayer id="osmLayer" />*/}
        {/*  </MapLibreGL.RasterSource>*/}

        {/*  {coords && (*/}
        {/*    <MapLibreGL.PointAnnotation id="marker" coordinate={coords}>*/}
        {/*      <CustomIcon source={icons.mapMarker} size={60} />*/}
        {/*    </MapLibreGL.PointAnnotation>*/}
        {/*  )}*/}
        {/*</MapLibreGL.MapView>*/}
      </View>

      <View className="gap-2 justify-center items-center">
        <CustomInput
          multiline
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
    </ScrollView>
  );
};
