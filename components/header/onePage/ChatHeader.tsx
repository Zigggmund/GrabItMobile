import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { CustomText } from '@/components/ui/text/CustomText';

interface ChatHeaderProps {
  username: string;
  avatarUrl: string;
  listingTitle: string;
}

export default function ChatHeader({
  username,
  avatarUrl,
  listingTitle,
}: ChatHeaderProps) {
  const { colors } = useTheme();

  return (
    <GreyBlock>
      <View className="flex-row gap-4 items-center px-2">
        <ProfileAvatar size={50} source={avatarUrl || null} username={username} />
        <View className="flex-1">
          <CustomText
            highlight
            style={{ color: colors.theme.blue.dark }}
            className="font-bold text-18"
            numberOfLines={1}
          >
            {username}
          </CustomText>
          <CustomText
            style={{ color: colors.theme.blue.bright }}
            className="text-13"
            numberOfLines={1}
          >
            {listingTitle}
          </CustomText>
        </View>
      </View>
    </GreyBlock>
  );
}
