import { useEffect } from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';

import { icons } from '@/constants/icons';

interface PreviewMediaModalProps {
  visible: boolean;
  uri: string;
  mediaType?: 'photo' | 'video';
  onClose: () => void;
}

export function PreviewMediaModal({
  visible,
  uri,
  mediaType = 'photo',
  onClose,
}: PreviewMediaModalProps) {
  const player = useVideoPlayer(null);

  useEffect(() => {
    if (visible && mediaType === 'video' && uri) {
      player.replace({ uri });
      player.play();
    } else {
      player.pause();
    }
  }, [visible, uri, mediaType]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/90">
        {mediaType === 'video' ? (
          <VideoView
            player={player}
            style={{ width: '90%', height: '60%' }}
            contentFit="contain"
            nativeControls
          />
        ) : (
          <Pressable
            style={{ width: '90%', height: '60%' }}
            onPress={onClose}
          >
            <Image
              source={{ uri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </Pressable>
        )}

        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: 48, right: 16, padding: 8 }}
        >
          <CustomIcon source={icons.cross} size={28} color="#ffffff" />
        </Pressable>
      </View>
    </Modal>
  );
}
