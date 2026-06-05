import { ActivityIndicator, FlatList, View } from 'react-native';

import { useGetConversations } from '@/hooks/chat/useGetConversations';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import { Chat } from '@/components/items/chats/Chat';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';

export default function MyChats() {
  const { data, isLoading, isError } = useGetConversations();
  const chats = data?.items ?? [];
  const { l } = useLanguage();
  const { colors } = useTheme();

  if (isLoading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );

  if (isError)
    return (
      <ScreenContainer>
        <ErrorMessage text={l.errorAPI} />
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      <View className="w-full px-6">
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => <Chat chat={item} index={index} />}
          ListEmptyComponent={() => (
            <CustomText
              highlight
              className="text-28 text-center"
              style={{ color: colors.theme.blue.primary }}
            >
              {l.emptyChatList}
            </CustomText>
          )}
        />
      </View>
    </ScreenContainer>
  );
}