import { ChatType } from '@/types/ChatType';

import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { useTheme } from '@/hooks/useTheme';

import { dateFormat } from '@/utils/dateFormat';

import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { CustomText } from '@/components/ui/text/CustomText';

interface ChatProps {
  chat: ChatType;
  index?: number;
}

export function Chat({ index = 1, chat }: ChatProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/chats/${chat.id}`)}>
      <GreyBlock index={index} className={'flex-row gap-4'}>
        <ProfileAvatar
          source={chat.talker.avatar?.url}
          id={chat.talker.id}
          size={50}
        />
        <View className={'flex-col gap-2 flex-1'}>
          <View className={'flex-row justify-between'}>
            <CustomText
              style={{ color: colors.theme.blue.dark }}
              highlight
              className={'font-bold text-18'}
            >
              {chat.talker.name}
            </CustomText>
            <CustomText
              style={{ color: colors.theme.grey.dark }}
              highlight
              className={'text-13'}
            >
              {dateFormat(chat.lastMessageDate)}
            </CustomText>
          </View>
          <CustomText
            style={{ color: colors.theme.blue.bright }}
            className={'text-16'}
          >
            {chat.adName}
          </CustomText>
        </View>
      </GreyBlock>
    </TouchableOpacity>
  );
}
