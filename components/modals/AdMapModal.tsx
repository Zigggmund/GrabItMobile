import { Modal, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';

const EMPTY_MAP_STYLE = { version: 8, sources: {}, layers: [] };

interface Props {
  visible: boolean;
  onClose: () => void;
  lat: number;
  lon: number;
}

export default function AdMapModal({ visible, onClose, lat, lon }: Props) {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.theme.white.primary }}>
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          mapStyle={EMPTY_MAP_STYLE}
        >
          <MapLibreGL.Camera
            zoomLevel={14}
            centerCoordinate={[lon, lat]}
          />
          <MapLibreGL.RasterSource
            id="adModalOsmSource"
            tileUrlTemplates={['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png']}
            tileSize={256}
          >
            <MapLibreGL.RasterLayer id="adModalOsmLayer" />
          </MapLibreGL.RasterSource>
          <MapLibreGL.ShapeSource
            id="adModalMarkerSource"
            shape={{
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [lon, lat] },
              properties: {},
            }}
          >
            <MapLibreGL.CircleLayer
              id="adModalMarkerCircle"
              style={{
                circleRadius: 10,
                circleColor: colors.base.orange.primary,
                circleStrokeWidth: 2,
                circleStrokeColor: '#ffffff',
              }}
            />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>

        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.theme.white.primary,
          }}
        >
          <CustomButton text={l.btnClose} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}