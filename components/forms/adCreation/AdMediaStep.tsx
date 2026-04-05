import { MediaType } from '@/types/MediaType';

import { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

export const AdMediaStep = ({ errors }: { errors: Record<string, string> }) => {
  const maxPreviewSize = 200 * 1024;
  const maxMediaSize = 1000 * 1024;
  const maxMediaCount = 10;

  const { l } = useLanguage();
  const { colors } = useTheme();
  const form = useForm();
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

    const mediaObj: MediaType = { id: Date.now(), url: uri };
    setPreview(mediaObj);
    form.changeAdCreationFormData('previewImage', mediaObj);
  };

  const handleAddMedia = async () => {
    const remaining = maxMediaCount - media.length;
    if (remaining <= 0) return;

    const result = await launchImageLibrary({
      selectionLimit: remaining,
      mediaType: 'photo',
    });
    if (!result.assets?.length) return;

    const newMedia: MediaType[] = [];

    for (const asset of result.assets) {
      if (!asset.uri) continue;

      let uri = asset.uri;

      if (asset.fileSize && asset.fileSize > maxMediaSize) {
        console.log('Media was compressed');
        uri = await compressImage(asset.uri, maxMediaSize);
      }

      newMedia.push({ id: Date.now() + Math.random(), url: uri });
    }

    const updatedMedia = [...media, ...newMedia];
    setMedia(updatedMedia);
    form.changeAdCreationFormData('uriMedias', updatedMedia);
  };

  const handleRemoveMedia = (id: number) => {
    const updatedMedia = media.filter(m => m.id !== id);
    setMedia(updatedMedia);
    form.changeAdCreationFormData('uriMedias', updatedMedia);
  };

  return (
    <View className="gap-2">
      <ScrollView>
        {/* Preview Photo */}
        <CustomText
          key={preview?.id}
          style={{ color: colors.theme.blue.dark }}
          className={'text-18'}
        >
          {l.preview}
        </CustomText>
        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: colors.base.grey.bright,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            overflow: 'hidden', // важно
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

        {/* Multiple Media */}
        <CustomText style={{ color: colors.theme.blue.dark }}>Media</CustomText>
        <View className="flex-row flex-wrap gap-2">
          {media.map(m => (
            <View
              key={m.id}
              style={{
                width: 100,
                height: 100,
                margin: 4,
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: m.url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />

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
      </ScrollView>
    </View>
  );
};
