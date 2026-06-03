import { MediaType } from '@/types/MediaType';

import { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaPreview } from '@/hooks/useMediaPreview';
import { useTheme } from '@/hooks/useTheme';

import { PreviewMediaModal } from '@/components/modals/PreviewMediaModal';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

import { toastService } from '@/services/toastService';

export const AdMediaStep = ({ errors }: { errors: Record<string, string> }) => {
  const maxPreviewSize = 200 * 1024;
  const maxMediaSize = 1000 * 1024;
  // пока размер как на бэкенде 3.5 мб
  const maxVideoSize = 3.5 * 1024 * 1024; // заменить 3.5 на 50/100
  const maxMediaCount = 10;

  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
  const { visible, uri, mediaType, openPreview, closePreview } =
    useMediaPreview();
  const [preview, setPreview] = useState<MediaType | null>(
    form.adCreationFormData.previewImage || null,
  );

  const [media, setMedia] = useState<MediaType[]>(
    form.adCreationFormData.uriMedias || [],
  );

  // сжатие
  const compressImage = async (uri: string, maxSize: number) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        uri,
        1080, // ширина
        1080, // высота
        'JPEG',
        80, // качество (%)
      );

      console.log('Original URI:', uri);
      console.log('Resized size (Kb):', (resized.size / 1024).toFixed(2));
      console.log('Resized URI:', resized.uri);

      // Размер всё ещё больше - пробуем снизить качество
      if (resized.size && resized.size > maxSize) {
        const quality = Math.max(10, (maxSize / resized.size) * 80); // динамическое качество
        const resizedAgain = await ImageResizer.createResizedImage(
          resized.uri,
          1080,
          1080,
          'JPEG',
          quality,
        );
        console.log(
          'Second compression size (Kb):',
          (resizedAgain.size / 1024).toFixed(2),
        );
        return resizedAgain.uri;
      }

      return resized.uri;
    } catch (e) {
      console.error('Ошибка сжатия изображения:', e);
      return uri;
    }
  };

  const handleSelectPreview = async () => {
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
    });
    if (!result.assets?.length) return;

    const asset = result.assets[0];
    if (!asset.uri) return;

    let uri = asset.uri;

    // Сжимаем, если файл слишком большой
    if (asset.fileSize && asset.fileSize > maxPreviewSize) {
      console.log('Preview-image was compressed');
      uri = await compressImage(asset.uri, maxPreviewSize);
    }

    const mediaObj: MediaType = { id: String(Date.now()), url: uri };
    setPreview(mediaObj);
    form.changeAdCreationFormData('previewImage', mediaObj);
  };

  const handleAddMedia = async () => {
    const remaining = maxMediaCount - media.length;
    if (remaining <= 0) return;

    const result = await launchImageLibrary({
      selectionLimit: remaining,
      mediaType: 'mixed',
    });
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
        console.log('Media was compressed');
        uri = await compressImage(asset.uri, maxMediaSize);
      }

      newMedia.push({
        id: String(Date.now() + Math.random()),
        url: uri,
        mediaType: isVideo ? 'video' : 'photo',
      });
    }

    const updatedMedia = [...media, ...newMedia];
    setMedia(updatedMedia);
    form.changeAdCreationFormData('uriMedias', updatedMedia);
  };

  const handleRemoveMedia = (id: string) => {
    const updatedMedia = media.filter(m => m.id !== id);
    setMedia(updatedMedia);
    form.changeAdCreationFormData('uriMedias', updatedMedia);
  };

  return (
    <View className="gap-2">
      <ScrollView>
        <View className={'justify-center items-center'}>
          {/* preview изображение */}
          <CustomText
            key={preview?.id}
            style={{ color: colors.theme.blue.dark }}
            className={'text-18'}
          >
            {l.preview}
          </CustomText>
          <View
            className={'justify-center items-center'}
            style={{
              width: 200,
              height: 200,
              backgroundColor: colors.base.grey.bright,
              borderRadius: 12,
              overflow: 'hidden',
            }}
            onTouchEnd={handleSelectPreview}
          >
            {preview ? (
              <Image
                key={preview?.url}
                source={{ uri: preview.url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <CustomIcon
                source={icons.add}
                size={32}
                color={colors.base.neutral.greyDark}
              />
            )}
          </View>
          {errors.previewImage && (
            <CustomText style={{ color: colors.base.red.primary }}>
              {errors.previewImage}
            </CustomText>
          )}

          {/* остальные медиа */}
          <CustomText
            style={{ color: colors.theme.blue.dark }}
            className={'text-18 mt-4'}
          >
            {l.additionalMediaFiles}
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {media.map(m => (
              <View
                key={m.id}
                style={{
                  width: 100,
                  height: 100,
                  margin: 4,
                  borderRadius: 12,
                }}
              >
                <Pressable
                  style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}
                  onPress={() => openPreview(m.url, m.mediaType ?? 'photo')}
                >
                  {m.mediaType === 'video' ? (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#111',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CustomText style={{ color: '#fff', fontSize: 28 }}>
                        ▶
                      </CustomText>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: m.url }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  )}
                </Pressable>

                {/* Крестик */}
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    zIndex: 10,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: 10,
                  }}
                >
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
                className={'mt-10'}
                size={32}
                color={colors.base.neutral.greyDark}
                onPress={handleAddMedia}
              />
            )}
          </View>
          {errors.uriMedias && (
            <CustomText style={{ color: colors.base.red.primary }}>
              {errors.uriMedias}
            </CustomText>
          )}
        </View>

      </ScrollView>

      <PreviewMediaModal
        visible={visible}
        uri={uri}
        mediaType={mediaType}
        onClose={closePreview}
      />
    </View>
  );
};
