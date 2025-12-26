import { Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { icons } from '@/constants/icons';

interface ProfileAvatarProps {
  size?: number;
  isProfilePage?: boolean;
  id?: number;
  source: string | undefined;
}

export function ProfileAvatar({
  size = 30,
  isProfilePage = false,
  source,
  id = 0,
}: ProfileAvatarProps) {
  const borderRadius = isProfilePage ? size / 3 : size / 2;
  const avatar = (
    <Image
      source={{ uri: source ?? icons.profile }}
      style={{
        resizeMode: 'cover',
        width: size,
        height: size,
        borderRadius,
      }}
    />
  );

  if (id <= 0 || isProfilePage) {
    return avatar;
  }

  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/users/${id}`)}>
      {avatar}
    </TouchableOpacity>
  );
}
