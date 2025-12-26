import { MessageType } from '@/types/ChatType';

import { View } from 'react-native';

import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';

import { timeFormat } from '@/utils/timeFormat';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface MessageProps {
  message: MessageType;
  width: number;
}

export function Message({ message, width }: MessageProps) {
  const { user } = useProfile();
  const { colors } = useTheme();
  const isMine = user?.id == message.userId;

  return (
    <View
      style={{
        justifyContent: 'flex-end',
        flexDirection: isMine ? 'row' : 'row-reverse',
      }}
      className={'flex-row gap-4'}
    >
      <View style={{ width: 36 }} className={'flex-col justify-end gap-2 w-6'}>
        <View
          style={{ justifyContent: isMine ? 'flex-end' : 'flex-start' }}
          className={'relative flex-row'}
        >
          {message.isReceive && (
            <CustomIcon
              source={icons.check}
              size={12}
              color={colors.theme.blue.bright}
            />
          )}

          {message.isRead && (
            <CustomIcon
              source={icons.check}
              size={12}
              color={colors.theme.blue.bright}
            />
          )}
        </View>
        <CustomText
          style={{ color: colors.theme.blue.bright }}
          className={'text-13'}
        >
          {timeFormat(message.date)}
        </CustomText>
      </View>
      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isMine
            ? colors.base.orange.bright
            : colors.theme.grey.dark,
          backgroundColor: isMine ? colors.base.orange.bright : colors.theme.white.primary,
          width: width,
          paddingVertical: 8,
        }}
        className={'px-4'}
      >
        <CustomText
          style={{
            color: isMine
              ? colors.base.neutral.whitePrimary
              : colors.theme.black.primary,
          }}
          className={'text-16'}
        >
          {message.text}
        </CustomText>
      </View>
    </View>
  );

  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.theme.grey.dark,
        backgroundColor: colors.theme.white.primary,
        justifyContent: 'flex-start',
      }}
      className={'gap-2 flex-row'}
    >
      <CustomText
        style={{
          color: isMine
            ? colors.base.neutral.whitePrimary
            : colors.theme.black.primary,
        }}
        className={'text-16'}
      >
        {message.text}
      </CustomText>
      <View className={'flex-col justify-end gap-2'}>
        <View>
          <CustomIcon
            style={{
              tintColor: colors.theme.blue.bright,
              display: message.isReceive ? 'flex' : 'none',
            }}
            source={icons.check}
            size={10}
          />
          <CustomIcon
            style={{
              tintColor: colors.theme.blue.bright,
              display: message.isRead ? 'flex' : 'none',
            }}
            source={icons.check}
            size={10}
          />
        </View>
        <CustomText>{timeFormat(message.date)}</CustomText>
      </View>
    </View>
  );
}
