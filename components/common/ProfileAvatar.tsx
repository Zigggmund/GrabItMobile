import { useCallback } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { useHistory } from '@/hooks/useHistory';

import { images } from '@/constants/images';

interface ProfileAvatarProps {
  size?: number;
  isProfilePage?: boolean;
  username?: string;
  source: string | null;
  cacheBuster?: number;
  className?: string;
  // gender?: 'male' | 'female';
}

export function ProfileAvatar({
  size = 30,
  isProfilePage = false,
  // gender = 'male',
  source,
  cacheBuster,
  username = '',
  className = '',
}: ProfileAvatarProps) {
  const { navigate } = useHistory();

  const onTouchableOpacityPress = useCallback(
    () =>
      navigate({
        pathname: '/(tabs)/users/[username]',
        params: { username: username },
      }),
    [navigate],
  );
  const borderRadius = isProfilePage ? size / 3 : size / 2;
  const imageUri = source ? `${source}?t=${cacheBuster ?? 0}` : null;
  const avatar = (
    <Image
      className={className}
      source={imageUri ? { uri: imageUri } : images.defaultProfile}
      style={{
        resizeMode: 'cover',
        width: size,
        height: size,
        borderRadius,
      }}
    />
  );

  if (username == '' || isProfilePage) {
    return avatar;
  }

  return (
    <TouchableOpacity onPress={onTouchableOpacityPress}>
      {avatar}
    </TouchableOpacity>
  );
}
