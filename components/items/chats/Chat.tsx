import { Image, TouchableOpacity, View } from 'react-native';

import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { CustomText } from '@/components/ui/text/CustomText';

import { dateFormat } from '@/utils/dateFormat';
import { ConversationEntity } from '@/types/entities/ChatType';

interface ChatProps {
  chat: ConversationEntity;
  index?: number;
}

export function Chat({ index = 1, chat }: ChatProps) {
  const { colors } = useTheme();
  const { l } = useLanguage();
  const { navigate } = useHistory();

  return (
    <TouchableOpacity
      onPress={() =>
        navigate({ pathname: '/(tabs)/chats/[id]', params: { id: chat.id } })
      }
    >
      <GreyBlock index={index} className={'flex-row gap-4 items-center'}>
        <View className="relative">
          <ProfileAvatar
            source={chat.otherAvatarUrl || null}
            username={chat.otherUsername}
            size={50}
          />
          {chat.unreadCount > 0 && (
            <View
              className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full items-center justify-center px-1"
              style={{ backgroundColor: colors.base.orange.primary }}
            >
              <CustomText className="text-11 font-bold" style={{ color: '#FFFFFF' }}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </CustomText>
            </View>
          )}
        </View>

        <View className="flex-col gap-1 flex-1">
          <View className="flex-row justify-between items-center">
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              highlight
              className="font-bold text-16"
              numberOfLines={1}
            >
              {chat.otherUsername}
            </CustomText>
            { chat.lastMessageAt && (
              <CustomText
                style={{ color: colors.theme.grey.dark }}
                highlight
                className="text-12"
              >
                {dateFormat(chat.lastMessageAt)}
              </CustomText>
            )}
          </View>
          <CustomText
            style={{ color: colors.theme.blue.bright }}
            className="text-14"
            numberOfLines={1}
          >
            {chat.listingTitle}
          </CustomText>
          {chat.lastMessage && (
            <CustomText
              style={{ color: colors.theme.grey.dark }}
              className="text-13"
              numberOfLines={1}
            >
              {chat.lastMessage.isDeleted
                ? `[${l.messageDeleted}]`
                : chat.lastMessage.content}
            </CustomText>
          )}
        </View>
      </GreyBlock>
    </TouchableOpacity>
  );
}