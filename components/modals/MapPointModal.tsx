import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  PermissionsAndroid,
  Platform,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Feature, Point } from 'geojson';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { cityCoordinates } from '@/constants/cityCoordinates';
import { RootState } from '@/state/store';

import { CustomButton } from '@/components/ui/button/CustomButton';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

const DEFAULT_RADIUS_KM = 5;

const EMPTY_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [],
};

function makeCirclePolygon(lat: number, lon: number, radiusKm: number, steps = 64) {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dLon = (radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.cos(angle);
    const dLat = (radiusKm / 110.574) * Math.sin(angle);
    coords.push([lon + dLon, lat + dLat]);
  }
  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [coords] },
    properties: {},
  };
}

interface MapPointModalProps {
  visible: boolean;
  onClose: () => void;
  /** Вызывается при нажатии «Применить». Координаты в [lat, lon], радиус в км. */
  onConfirm: (lat: number, lon: number, radiusKm: number) => void;
  /** Начальные координаты (если фильтр уже был задан ранее) */
  initialLat?: number | null;
  initialLon?: number | null;
  initialRadius?: number;
}

export const MapPointModal = ({
  visible,
  onClose,
  onConfirm,
  initialLat,
  initialLon,
  initialRadius = DEFAULT_RADIUS_KM,
}: MapPointModalProps) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const currentCity = useSelector((state: RootState) => state.city.currentCity);
  const cityCenter = cityCoordinates[currentCity];

  // coords: [lat, lon]
  const [coords, setCoords] = useState<[number, number] | null>(
    initialLat != null && initialLon != null ? [initialLat, initialLon] : null,
  );
  const [radiusText, setRadiusText] = useState(String(initialRadius));

  useEffect(() => {
    if (visible) {
      setCoords(
        initialLat != null && initialLon != null
          ? [initialLat, initialLon]
          : null,
      );
      setRadiusText(String(initialRadius));
    }
  }, [visible]);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      // iOS запрашивает сама
      return true;
    } catch {
      return false;
    }
  };

  // текущее местоположение если точка ещё не выбрана
  useEffect(() => {
    if (!visible || coords) return;

    const getPosition = async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;

      Geolocation.getCurrentPosition(
        pos => {
          setCoords([pos.coords.latitude, pos.coords.longitude]);
        },
        err => {
          console.warn('Geolocation error:', err);
          if (cityCenter) setCoords([cityCenter.lat, cityCenter.lon]);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    getPosition();
  }, [visible]);

  const handleMapPress = (e: Feature) => {
    const geom = e.geometry;
    if (geom?.type === 'Point') {
      const point = geom as Point;
      const [lon, lat] = point.coordinates;
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        setCoords([lat, lon]);
      } else {
        console.warn('Invalid coordinates from map press:', lat, lon);
      }
    }
  };

  const handleConfirm = () => {
    if (!coords) return;
    const radius = parseFloat(radiusText.replace(',', '.'));
    onConfirm(
      coords[0],
      coords[1],
      isNaN(radius) || radius <= 0 ? DEFAULT_RADIUS_KM : radius,
    );
    onClose();
  };

  const parsedRadius = parseFloat(radiusText.replace(',', '.'));
  const currentRadius = isNaN(parsedRadius) || parsedRadius <= 0 ? DEFAULT_RADIUS_KM : parsedRadius;

  const radiusGeoJSON = useMemo(() => {
    if (!coords) return null;
    return makeCirclePolygon(coords[0], coords[1], currentRadius);
  }, [coords, currentRadius]);

  const cameraCenter: [number, number] = coords
    ? [coords[1], coords[0]]
    : cityCenter ? [cityCenter.lon, cityCenter.lat] : [37.618423, 55.751244];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.theme.white.primary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View
          style={{
            height: 48,
            paddingHorizontal: 16,
            justifyContent: 'center',
            zIndex: 10,
            elevation: 10,
          }}
        >
          <CustomText
            highlight
            style={{ color: colors.theme.blue.primary }}
            className={'self-center text-20 font-bold'}
          >
            {l.adMapStep}
          </CustomText>
        </View>


        {/* Карта */}
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          mapStyle={EMPTY_MAP_STYLE}
          onPress={handleMapPress}
        >
          <MapLibreGL.Camera zoomLevel={12} centerCoordinate={cameraCenter} />

          <MapLibreGL.RasterSource
            id="osmSource"
            tileUrlTemplates={[
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ]}
            tileSize={256}
          >
            <MapLibreGL.RasterLayer id="osmLayer" />
          </MapLibreGL.RasterSource>

          {radiusGeoJSON && (
            <MapLibreGL.ShapeSource id="radiusSource" shape={radiusGeoJSON}>
              <MapLibreGL.FillLayer
                id="radiusFill"
                style={{ fillColor: colors.theme.blue.bright, fillOpacity: 0.15 }}
              />
              <MapLibreGL.LineLayer
                id="radiusLine"
                style={{ lineColor: colors.theme.blue.bright, lineWidth: 2, lineOpacity: 0.7 }}
              />
            </MapLibreGL.ShapeSource>
          )}

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
                  circleStrokeColor: colors.base.neutral.whiteBright,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>

        <View
          className={'px-4 pt-3 pb-6 gap-3'}
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.theme.blue.primary,
          }}
        >
          {coords && (
            <CustomText
              className={'text-14'}
              style={{ color: colors.theme.blue.primary }}
            >
              {l.coordinates}: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
            </CustomText>
          )}

          <CustomInput
            label={l.searchRadius}
            value={radiusText}
            onChangeText={setRadiusText}
            keyboardType={'numeric'}
            placeholder={String(DEFAULT_RADIUS_KM)}
          />

          <View className={'flex-row gap-3'}>
            <CustomButton
              type={'red'}
              text={l.btnCancel}
              onPress={onClose}
              className={'flex-1'}
            />
            <CustomButton
              type={'green'}
              text={l.btnConfirm}
              onPress={handleConfirm}
              disabled={!coords}
              className={'flex-1'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
