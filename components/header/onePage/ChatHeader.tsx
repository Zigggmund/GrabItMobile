import { UserCardType } from '@/types/UserType';

import { View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import GreyBlock from '@/components/common/GreyBlock';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import { CustomText } from '@/components/ui/text/CustomText';

interface ChatHeaderProps {
  userCard: UserCardType;
  isOnline: boolean;
}

export default function ChatHeader({
  userCard,
  isOnline,
}: ChatHeaderProps) {
  const { l } = useLanguage();
  const { colors } = useTheme();

  return (
    <GreyBlock>
      <View
        className={`flex-row justify-between px-2 items-center`}
      >
        <View className={'gap-4 flex-row items-center'}>
          <ProfileAvatar size={54} source={userCard.avatar?.url} id={userCard.id} />
          <CustomText
            highlight
            style={{ color: colors.theme.blue.dark }}
            className={'font-bold text-20'}
          >
            {userCard.name}
          </CustomText>
        </View>
        <CustomText
          className={'text-14'}
          style={{
            color: isOnline
              ? colors.base.green.primary
              : colors.base.red.primary,
          }}
        >
          {isOnline ? l.online : l.offline}
        </CustomText>
      </View>
    </GreyBlock>
  );
}
