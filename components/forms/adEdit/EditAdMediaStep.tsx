import { MediaType } from '@/types/MediaType';

import { Image, Pressable, ScrollView, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaPreview } from '@/hooks/useMediaPreview';
import { useTheme } from '@/hooks/useTheme';

import { toastService } from '@/services/toastService';

import { PreviewMediaModal } from '@/components/modals/PreviewMediaModal';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

const maxMediaSize = 1000 * 1024;
const maxVideoSize = 3.5 * 1024 * 1024;
const maxMediaCount = 10;

const compressImage = async (uri: string): Promise<string> => {
  try {
    const resized = await ImageResizer.createResizedImage(uri, 1080, 1080, 'JPEG', 80);
    if (resized.size && resized.size > maxMediaSize) {
      const quality = Math.max(10, (maxMediaSize / resized.size) * 80);
      const resizedAgain = await ImageResizer.createResizedImage(resized.uri, 1080, 1080, 'JPEG', quality);
      return resizedAgain.uri;
    }
    return resized.uri;
  } catch {
    return uri;
  }
};

export const EditAdMediaStep = ({ errors }: { errors: Record<string, string> }) => {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
  const { visible, uri, mediaType, openPreview, closePreview } = useMediaPreview();

  const media = form.adCreationFormData.uriMedias;

  const setMedia = (updated: MediaType[]) => {
    form.changeAdCreationFormData('uriMedias', updated);
  };

  const handleAddMedia = async () => {
    const remaining = maxMediaCount - media.length;
    if (remaining <= 0) return;

    const result = await launchImageLibrary({ selectionLimit: remaining, mediaType: 'mixed' });
    if (!result.assets?.length) return;

    const newMedia: MediaType[] = [];

    for (const asset of result.assets) {
      if (!asset.uri) continue;
      const isVideo = asset.type?.startsWith('video') ?? false;
      let uri = asset.uri;

      if (isVideo) {
        if (asset.fileSize && asset.fileSize > maxVideoSize) {
          toastService.error(l.errorVideoTooBig);
          continue;
        }
      } else if (asset.fileSize && asset.fileSize > maxMediaSize) {
        uri = await compressImage(asset.uri);
      }

      newMedia.push({ id: String(Date.now() + Math.random()), url: uri, mediaType: isVideo ? 'video' : 'photo' });
    }

    setMedia([...media, ...newMedia]);
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  return (
    <View className="gap-2">
      <ScrollView>
        <CustomText style={{ color: colors.theme.blue.dark }} className="text-18">
          {l.additionalMediaFiles}
        </CustomText>

        <View className="flex-row flex-wrap gap-2">
          {media.map(m => (
            <View
              key={m.id}
              style={{ width: 100, height: 100, margin: 4, position: 'relative', borderRadius: 12, overflow: 'hidden' }}
            >
              <Pressable
                style={{ width: '100%', height: '100%' }}
                onPress={() => openPreview(m.url, m.mediaType ?? 'photo')}
              >
                {m.mediaType === 'video' ? (
                  <View style={{ width: '100%', height: '100%', backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
                    <CustomText style={{ color: '#fff', fontSize: 28 }}>▶</CustomText>
                  </View>
                ) : (
                  <Image source={{ uri: m.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                )}
              </Pressable>

              <View style={{ position: 'absolute', top: 2, right: 2, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 10 }}>
                <CustomIcon
                  source={icons.cross}
                  size={18}
                  color={colors.base.red.primary}
                  onPress={() => handleRemoveMedia(m.id)}
                />
              </View>
            </View>
          ))}

          {media.length < maxMediaCount && (
            <CustomIcon
              source={icons.add}
              size={32}
              color={colors.base.neutral.greyDark}
              onPress={handleAddMedia}
            />
          )}
        </View>

        {errors.uriMedias && (
          <CustomText style={{ color: colors.base.red.primary }}>{errors.uriMedias}</CustomText>
        )}
      </ScrollView>

      <PreviewMediaModal visible={visible} uri={uri} mediaType={mediaType} onClose={closePreview} />
    </View>
  );
};