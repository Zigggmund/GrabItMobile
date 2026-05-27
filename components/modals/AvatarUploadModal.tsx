import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import { useUploadAvatar } from '@/hooks/media/useUploadAvatar';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

const MAX_AVATAR_SIZE = 4 * 1024 * 1024; // 4 МБ по swagger

interface Props {
  visible: boolean;
  onClose: () => void;
  currentAvatarUrl: string | null;
}

export default function AvatarUploadModal({
  visible,
  onClose,
  currentAvatarUrl,
}: Props) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const uploadAvatar = useUploadAvatar();

  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [error, setError] = useState('');

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const resized = await ImageResizer.createResizedImage(
        uri,
        1080,
        1080,
        'JPEG',
        80,
      );
      if (resized.size && resized.size > MAX_AVATAR_SIZE) {
        const quality = Math.max(10, (MAX_AVATAR_SIZE / resized.size) * 80);
        const resizedAgain = await ImageResizer.createResizedImage(
          resized.uri,
          1080,
          1080,
          'JPEG',
          quality,
        );
        return resizedAgain.uri;
      }
      return resized.uri;
    } catch {
      return uri;
    }
  };

  const handleSelectPhoto = async () => {
    setError('');
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
    });

    if (!result.assets?.length) return;

    const asset = result.assets[0];
    if (!asset.uri) return;

    let uri = asset.uri;
    if (asset.fileSize && asset.fileSize > MAX_AVATAR_SIZE) {
      uri = await compressImage(asset.uri);
    }

    setSelectedUri(uri);
  };

  const handleUpload = () => {
    if (!selectedUri) return;
    setError('');

    uploadAvatar.mutate(selectedUri, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['me'] });
        setSelectedUri(null);
        onClose();
      },
      onError: () => {
        setError(l.errorSaveProfile);
      },
    });
  };

  const handleClose = () => {
    setSelectedUri(null);
    setError('');
    onClose();
  };

  const previewUri = selectedUri ?? currentAvatarUrl;
  const PREVIEW_SIZE = 220;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000066',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        <View
          style={{
            backgroundColor: colors.theme.white.primary,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            gap: 16,
            alignItems: 'center',
          }}
        >
          <CustomText
            style={{ color: colors.theme.blue.dark }}
            className={'text-24 font-bold'}
            highlight
          >
            {l.uploadAvatarTitle}
          </CustomText>

          {/* Превью */}
          <Pressable onPress={handleSelectPhoto}>
            <View
              style={{
                width: PREVIEW_SIZE,
                height: PREVIEW_SIZE,
                borderRadius: PREVIEW_SIZE / 4,
                overflow: 'hidden',
                backgroundColor: colors.base.grey.bright,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {previewUri ? (
                <Image
                  source={{ uri: previewUri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <CustomIcon
                  source={icons.add}
                  size={48}
                  color={colors.base.neutral.greyDark}
                />
              )}
            </View>
          </Pressable>

          {selectedUri && (
            <CustomText
              style={{ color: colors.base.neutral.greyDark }}
              className={'text-13'}
            >
              {l.selectPhoto} ↑
            </CustomText>
          )}

          {error !== '' && (
            <CustomText
              style={{ color: colors.base.red.primary }}
              className={'text-14 text-center'}
            >
              {error}
            </CustomText>
          )}

          {uploadAvatar.isPending && (
            <ActivityIndicator color={colors.base.orange.primary} />
          )}

          <View className={'flex-row gap-3 w-full mb-2'}>
            <CustomButton
              type={'secondary'}
              text={l.changePhoto}
              className={'flex-1'}
              onPress={handleSelectPhoto}
              disabled={uploadAvatar.isPending}
            />
            <CustomButton
              text={uploadAvatar.isPending ? l.loading : l.btnUpload}
              className={'flex-1'}
              disabled={!selectedUri || uploadAvatar.isPending}
              onPress={handleUpload}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
