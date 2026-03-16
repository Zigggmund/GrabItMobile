import { Image, TouchableOpacity } from 'react-native';

import { useHistory } from '@/hooks/useHistory';

import { icons } from '@/constants/icons';

interface ProfileAvatarProps {
  size?: number;
  isProfilePage?: boolean;
  id?: number;
  source: string | undefined;
  className?: string;
}

export function ProfileAvatar({
  size = 30,
  isProfilePage = false,
  source,
  id = 0,
  className = '',
}: ProfileAvatarProps) {
  const { navigate } = useHistory();
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

  if (id <= 0 || isProfilePage) {
    return avatar;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigate({ pathname: '/(tabs)/users/[id]', params: { id: String(id) } })
      }
    >
      {avatar}
    </TouchableOpacity>
  );
}
