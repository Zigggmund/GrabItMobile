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
  const MAX_PHOTO_SIZE = 20 * 1024 * 1024; // 20MB — лимит бэкенда
  const COMPRESS_THRESHOLD = 2 * 1024 * 1024; // сжимаем если > 2MB для оптимизации загрузки
  const maxPhotoCount = 10;
  const maxVideoCount = 1;

  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
  const { visible, uri, mediaType, openPreview, closePreview } =
    useMediaPreview();
  const [preview, setPreview] = useState<MediaType | null>(
    form.AdFormData.previewImage || null,
  );

  const [media, setMedia] = useState<MediaType[]>(
    form.AdFormData.uriMedias || [],
  );

  // сжатие
  const compressImage = async (uri: string, maxSize: number) => {
    try {
      const resized = await ImageResizer.createResizedImage(uri, 1080, 1080, 'JPEG', 80);
      if (resized.size && resized.size > maxSize) {
        const quality = Math.max(10, (maxSize / resized.size) * 80);
        const resizedAgain = await ImageResizer.createResizedImage(resized.uri, 1080, 1080, 'JPEG', quality);
        return resizedAgain.uri;
      }
      return resized.uri;
    } catch {
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

    if (asset.fileSize && asset.fileSize > MAX_PHOTO_SIZE) {
      toastService.error(l.errorPhotoTooBig);
      return;
    }
    if (asset.fileSize && asset.fileSize > COMPRESS_THRESHOLD) {
      uri = await compressImage(asset.uri, COMPRESS_THRESHOLD);
    }

    const mediaObj: MediaType = { id: String(Date.now()), url: uri };
    setPreview(mediaObj);
    form.changeAdFormData('previewImage', mediaObj);
  };

  const currentPhotos = media.filter(m => m.mediaType !== 'video').length;
  const currentVideos = media.filter(m => m.mediaType === 'video').length;
  const remainingPhotos = maxPhotoCount - 1 - currentPhotos; // -1 для preview
  const remainingVideos = maxVideoCount - currentVideos;
  const canAddMore = remainingPhotos > 0 || remainingVideos > 0;

  const handleAddMedia = async () => {
    if (!canAddMore) return;

    const result = await launchImageLibrary({
      selectionLimit: remainingPhotos + remainingVideos,
      mediaType: remainingVideos > 0 ? 'mixed' : 'photo',
    });
    if (!result.assets?.length) return;

    const newMedia: MediaType[] = [];
    let addedPhotos = 0;
    let addedVideos = 0;

    for (const asset of result.assets) {
      if (!asset.uri) continue;
      const isVideo = asset.type?.startsWith('video') ?? false;

      if (isVideo) {
        if (currentVideos + addedVideos >= maxVideoCount) continue;
        newMedia.push({ id: String(Date.now() + Math.random()), url: asset.uri, mediaType: 'video' });
        addedVideos++;
      } else {
        if (currentPhotos + addedPhotos >= maxPhotoCount - 1) continue;
        if (asset.fileSize && asset.fileSize > MAX_PHOTO_SIZE) {
          toastService.error(l.errorPhotoTooBig);
          continue;
        }
        let uri = asset.uri;
        if (asset.fileSize && asset.fileSize > COMPRESS_THRESHOLD) {
          uri = await compressImage(asset.uri, COMPRESS_THRESHOLD);
        }
        newMedia.push({ id: String(Date.now() + Math.random()), url: uri, mediaType: 'photo' });
        addedPhotos++;
      }
    }

    const updatedMedia = [...media, ...newMedia];
    setMedia(updatedMedia);
    form.changeAdFormData('uriMedias', updatedMedia);
  };

  const handleRemoveMedia = (id: string) => {
    const updatedMedia = media.filter(m => m.id !== id);
    setMedia(updatedMedia);
    form.changeAdFormData('uriMedias', updatedMedia);
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

            {canAddMore && (
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
