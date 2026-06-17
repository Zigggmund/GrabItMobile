import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useGetConversations } from '@/hooks/chat/useGetConversations';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import { Chat } from '@/components/items/chats/Chat';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomText } from '@/components/ui/text/CustomText';
import { ConversationEntity } from '@/types/entities/ChatType';

export default function MyChats() {
  const { l } = useLanguage();
  const { colors } = useTheme();

  const [page, setPage] = useState(1);
  const [all, setAll] = useState<ConversationEntity[]>([]);

  const { data, isLoading, isError, isFetching } = useGetConversations(page);

  useEffect(() => {
    if (!data?.items) return;
    setAll(prev => {
      if (page === 1) return data.items;
      const ids = new Set(prev.map(c => c.id));
      return [...prev, ...data.items.filter(c => !ids.has(c.id))];
    });
  }, [data]);

  if (isLoading && all.length === 0)
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
          data={all}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => <Chat chat={item} index={index} />}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (data?.hasMore && !isFetching) setPage(p => p + 1);
          }}
          ListFooterComponent={() =>
            isFetching && all.length > 0 ? <ActivityIndicator /> : null
          }
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
