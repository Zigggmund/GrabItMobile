import { Image, TouchableOpacity } from 'react-native';

import { useHistory } from '@/hooks/useHistory';

import { icons } from '@/constants/icons';
import { useCallback } from 'react';

interface ProfileAvatarProps {
  size?: number;
  isProfilePage?: boolean;
  username?: string;
  source: string | null;
  className?: string;
}

export function ProfileAvatar({
  size = 30,
  isProfilePage = false,
  source,
  username = '',
  className = '',
}: ProfileAvatarProps) {
  const { navigate } = useHistory();

  const onTouchableOpacityPress = useCallback(() =>
    navigate({ pathname: '/(tabs)/users/[username]', params: { username: username } }), [navigate]);
  const borderRadius = isProfilePage ? size / 3 : size / 2;
  const avatar = (
    <Image
      className={className}
      source={{ uri: source ?? icons.profile }}
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
    <TouchableOpacity
      onPress={onTouchableOpacityPress
      }
    >
      {avatar}
    </TouchableOpacity>
  );
}
