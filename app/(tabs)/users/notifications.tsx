import { NotificationType } from '@/types/entities/NotificationType';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { useGetNotifications } from '@/hooks/notification/useGetNotifications';
import { useGetPreferences } from '@/hooks/notification/useGetPreferences';
import { useMarkAllRead } from '@/hooks/notification/useMarkAllRead';
import { useMarkRead } from '@/hooks/notification/useMarkRead';
import { useUpdatePreferences } from '@/hooks/notification/useUpdatePreferences';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { Tag } from '@/components/common/Tag';
import { NotificationItem } from '@/components/items/notifications/NotificationItem';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomAlert } from '@/components/modals/CustomAlert';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

import { NotificationPreferencesDto } from '@/services/api/services/dto/notification.dto';

export default function NotificationsPage() {
  const { l } = useLanguage();
  const { colors } = useTheme();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<NotificationType[]>([]);

  const { data, isFetching, refetch } = useGetNotifications(filter, page);
  const { data: preferences } = useGetPreferences();
  const markAll = useMarkAllRead();
  const markRead = useMarkRead();
  const update = useUpdatePreferences();

  const [prefState, setPrefState] = useState<NotificationPreferencesDto>({
    email_enabled: false,
    mobile_push_enabled: false,
    browser_push_enabled: false,
    inbox_enabled: true,
  });

  useEffect(() => {
    if (preferences) setPrefState(preferences);
  }, [preferences]);

  // Локально прочитанные (визуальный эффект без запроса)
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set());
  // Буфер для батчевой отправки при уходе со страницы
  const pendingReadRef = useRef<Set<string>>(new Set());
  const markReadMutateRef = useRef(markRead.mutate);
  markReadMutateRef.current = markRead.mutate;

  useFocusEffect(
    useCallback(() => {
      return () => {
        const ids = [...pendingReadRef.current];
        if (ids.length > 0) {
          markReadMutateRef.current(ids);
          pendingReadRef.current = new Set();
        }
      };
    }, []),
  );

  const handleRead = (id: string) => {
    setLocalReadIds(prev => new Set([...prev, id]));
    pendingReadRef.current.add(id);
  };

  const handleMark = async () => {
    const confirmed = await CustomAlert({
      message: l.btnMarkAllReadConfirm,
      confirmation: l.confirmation,
      btnCancel: l.btnCancel,
      btnConfirm: l.btnConfirm,
    });
    if (confirmed) markAll.mutate();
  };

  useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [filter]);

  useEffect(() => {
    if (!data?.items) return;
    setAllItems(prev => {
      if (page === 1) return data.items;
      const ids = new Set(prev.map(i => i.id));
      return [...prev, ...data.items.filter(i => !ids.has(i.id))];
    });
  }, [data]);

  const total = data?.total ?? 0;

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const prefRows: { label: string; key: keyof NotificationPreferencesDto }[] = [
    { label: l.notifEmailEnabled, key: 'email_enabled' },
    { label: l.notifPushEnabled, key: 'mobile_push_enabled' },
    { label: l.notifBrowserEnabled, key: 'browser_push_enabled' },
    { label: l.notifInboxEnabled, key: 'inbox_enabled' },
  ];

  return (
    <ScreenContainer isCentered={false} className="px-4">
      <FlatList
        data={allItems}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <NotificationItem
            notification={{ ...item, isRead: item.isRead || localReadIds.has(item.id) }}
            index={index}
            onRead={handleRead}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={() => {
          if (allItems.length < total && !isFetching) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={isFetching && page === 1}
        onRefresh={handleRefresh}
        ListFooterComponent={() =>
          isFetching && page > 1 ? <ActivityIndicator /> : null
        }
        ListEmptyComponent={() =>
          !isFetching ? (
            <CustomText
              className="text-20 text-center mt-8"
              style={{ color: colors.theme.blue.primary }}
            >
              {l.emptyNotificationList}
            </CustomText>
          ) : null
        }
        ListHeaderComponent={
          <View className="gap-4 pb-4 px-4">
            <View className="flex-row items-center justify-center flex-wrap gap-2">
              <CustomText
                style={{ color: colors.base.orange.primary }}
                className={'text-50 font-medium'}
                highlight
              >
                {l.notifications}
              </CustomText>

              <View className="flex-row gap-4 justify-start w-full">
                <TouchableOpacity
                  onPress={() => setSettingsVisible(prev => !prev)}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    backgroundColor: settingsVisible
                      ? colors.base.orange.primary
                      : colors.theme.white.primary,
                  }}
                >
                  <CustomIcon
                    source={icons.settings}
                    size={30}
                    color={
                      settingsVisible
                        ? colors.base.neutral.whitePrimary
                        : colors.theme.blue.primary
                    }
                  />
                </TouchableOpacity>

                <CustomButton
                  isSmall
                  type="secondary"
                  text={l.markAllRead}
                  disabled={markAll.isPending}
                  onPress={handleMark}
                />
              </View>
            </View>

            {settingsVisible && (
              <View
                className="rounded-xl px-4 py-3 gap-1"
                style={{ backgroundColor: colors.theme.white.primary }}
              >
                <CustomText
                  className="text-16 font-bold mb-1"
                  style={{ color: colors.theme.blue.dark }}
                >
                  {l.notifSettings}
                </CustomText>

                {preferences ? (
                  <>
                    {prefRows.map(({ label, key }) => (
                      <View
                        key={key}
                        className="flex-row items-center justify-between py-3 px-1"
                        style={{
                          borderBottomWidth: 1,
                          borderColor: colors.theme.white.bright,
                        }}
                      >
                        <CustomText
                          className="text-16"
                          style={{ color: colors.theme.blue.primary }}
                        >
                          {label}
                        </CustomText>
                        <Switch
                          value={prefState[key]}
                          onValueChange={v =>
                            setPrefState(prev => ({ ...prev, [key]: v }))
                          }
                          trackColor={{
                            true: colors.base.orange.primary,
                            false: colors.theme.white.primary,
                          }}
                          thumbColor={colors.base.neutral.whiteBright}
                        />
                      </View>
                    ))}

                    <View className="mt-4">
                      <CustomButton
                        isSmall
                        type="secondary"
                        text={l.btnSave}
                        disabled={update.isPending}
                        onPress={() => update.mutate(prefState)}
                      />
                    </View>
                  </>
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}

            <View className="flex-row gap-3">
              <Tag
                label={l.bookingAll}
                selected={filter === 'all'}
                onPress={() => setFilter('all')}
              />
              <Tag
                label={l.onlyUnread}
                selected={filter === 'unread'}
                onPress={() => setFilter('unread')}
              />
            </View>
          </View>
        }
      />
    </ScreenContainer>
  );
}