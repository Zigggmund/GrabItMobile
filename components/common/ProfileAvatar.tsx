import { Image } from 'react-native';

interface ProfileAvatarProps {
  size?: number;
  source: string;
}

export function ProfileAvatar({ size = 30, source }: ProfileAvatarProps) {
  return (
    <Image
      source={{ uri: source }}
      style={{
        resizeMode: 'cover',
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
}
