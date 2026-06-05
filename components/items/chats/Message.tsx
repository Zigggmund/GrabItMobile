import { View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useProfile } from '@/hooks/user/useProfile';
import { useTheme } from '@/hooks/useTheme';

import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { timeFormat } from '@/utils/timeFormat';
import { BookingEventType, MessageEntity } from '@/types/entities/ChatType';

interface MessageProps {
  message: MessageEntity;
  width: number;
}

function getSystemLabel(eventType: BookingEventType, l: ReturnType<typeof useLanguage>['l']): string {
  switch (eventType) {
    case 'booking_created':   return l.systemBookingCreated;
    case 'booking_confirmed': return l.systemBookingConfirmed;
    case 'booking_rejected':  return l.systemBookingRejected;
    case 'booking_cancelled': return l.systemBookingCancelled;
    default:                  return '';
  }
}

export function Message({ message, width }: MessageProps) {
  const { user } = useProfile();
  const { colors } = useTheme();
  const { l } = useLanguage();
  const isMine = user?.id === message.senderId;
  const isRead = message.readAt !== null;

  if (message.isSystem) {
    return (
      <View className="items-center py-1">
        <View
          className="rounded-xl px-4 py-1.5"
          style={{ backgroundColor: colors.base.grey.bright }}
        >
          <CustomText
            className="text-12 text-center"
            style={{ color: colors.theme.blue.bright }}
          >
            {getSystemLabel(message.eventType, l)}
          </CustomText>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        justifyContent: 'flex-end',
        flexDirection: isMine ? 'row' : 'row-reverse',
      }}
      className="flex-row gap-4"
    >
      <View style={{ width: 36 }} className="flex-col justify-end gap-2">
        {isMine && (
          <View
            style={{ justifyContent: 'flex-end' }}
            className="relative flex-row"
          >
            <CustomIcon
              source={icons.check}
              size={12}
              color={colors.theme.blue.bright}
            />
            {isRead && (
              <CustomIcon
                source={icons.check}
                size={12}
                color={colors.theme.blue.bright}
              />
            )}
          </View>
        )}
        <CustomText style={{ color: colors.theme.blue.bright }} className="text-12">
          {timeFormat(message.sentAt)}
        </CustomText>
      </View>

      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isMine
            ? colors.base.orange.bright
            : colors.theme.grey.dark,
          backgroundColor: isMine
            ? colors.base.orange.bright
            : colors.theme.white.primary,
          width: width,
          paddingVertical: 8,
        }}
        className="px-4"
      >
        {message.isDeleted ? (
          <CustomText
            style={{
              color: isMine
                ? colors.base.neutral.whitePrimary
                : colors.theme.grey.dark,
              fontStyle: 'italic',
            }}
            className="text-15"
          >
            {l.messageDeleted}
          </CustomText>
        ) : (
          <CustomText
            style={{
              color: isMine
                ? colors.base.neutral.whitePrimary
                : colors.theme.black.primary,
            }}
            className="text-15"
          >
            {message.content}
          </CustomText>
        )}
      </View>
    </View>
  );
}
