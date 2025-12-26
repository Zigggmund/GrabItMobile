import { FlatList, View } from 'react-native';

import { Chat } from '@/components/items/chats/Chat';
import ScreenContainer from '@/components/layout/ScreenContainer';

import { mockChats } from '@/constants/mocks/mockChats';

export default function MyChats() {
  return (
    <ScreenContainer>
      <View className={'w-full px-6'}>
        <FlatList
          data={mockChats}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => <Chat chat={item} index={index} />}
        />
      </View>

    </ScreenContainer>
  );
}
