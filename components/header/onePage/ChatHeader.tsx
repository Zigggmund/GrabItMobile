import { Alert, TouchableOpacity, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { CustomText } from '@/components/ui/text/CustomText';

interface ChatHeaderProps {
  username: string;
  avatarUrl: string;
  listingTitle: string;
  isMuted: boolean;
  blockedByMe: boolean;
  onMuteToggle: () => void;
  onBlockToggle: () => void;
}

export default function ChatHeader({
  username,
  avatarUrl,
  listingTitle,
  isMuted,
  blockedByMe,
  onMuteToggle,
  onBlockToggle,
}: ChatHeaderProps) {
  const { colors } = useTheme();
  const { l } = useLanguage();

  const openMenu = () => {
    Alert.alert(l.chatSettings, undefined, [
      {
        text: isMuted ? l.unmuteConversation : l.muteConversation,
        onPress: onMuteToggle,
      },
      {
        text: blockedByMe ? l.unblockUser : l.blockUser,
        style: blockedByMe ? undefined : 'destructive',
        onPress: onBlockToggle,
      },
      { text: l.btnCancel, style: 'cancel' },
    ]);
  };

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
        <TouchableOpacity onPress={openMenu} hitSlop={8} className="p-2">
          <CustomText
            style={{ color: colors.theme.blue.bright }}
            className="text-20 font-bold"
          >
            ···
          </CustomText>
        </TouchableOpacity>
      </View>
    </GreyBlock>
  );
}
