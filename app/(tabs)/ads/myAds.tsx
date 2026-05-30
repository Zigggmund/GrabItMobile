import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';

import { mapAd } from '@/hooks/ad/mapAd';
import { useDeleteListing } from '@/hooks/ad/useDeleteListing';
import { MyAdStatus, useGetMyAds } from '@/hooks/ad/useGetMyAds';
import { usePauseListing } from '@/hooks/ad/usePauseListing';
import { useResumeListing } from '@/hooks/ad/useResumeListing';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import BigAd from '@/components/items/ads/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { BIG_AD_WIDTH } from '@/constants/sizes';

import { AdResponseDto } from '@/services/api/services/dto/ad.dto';

const STATUS_LIST: MyAdStatus[] = ['active', 'paused', 'deleted'];

export default function MyAdsPage() {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const { navigate } = useHistory();

  const [status, setStatus] = useState<MyAdStatus>('active');

  const { data: ads = [], isLoading, isError } = useGetMyAds(status);
  const pauseListing = usePauseListing();
  const resumeListing = useResumeListing();
  const deleteListing = useDeleteListing();

  const isAnyPending =
    pauseListing.isPending ||
    resumeListing.isPending ||
    deleteListing.isPending;

  const statusLabel: Record<MyAdStatus, string> = {
    active: l.active,
    paused: l.paused,
    deleted: l.deleted,
  };

  const handleDelete = (listingId: string) => {
    Alert.alert(l.confirmation, l.warningDeleteAd, [
      { text: l.btnCancel, style: 'cancel' },
      {
        text: l.btnDelete,
        style: 'destructive',
        onPress: () => deleteListing.mutate(listingId),
      },
    ]);
  };

  const renderItem = ({ item }: { item: AdResponseDto }) => (
    <View style={{ gap: 8 }}>
      <BigAd width={BIG_AD_WIDTH} ad={mapAd(item)} />
      {item.status !== 'deleted' && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {item.status === 'active' ? (
            <CustomButton
              isSmall
              textClassName="text-14"
              className="flex-1"
              text={l.btnPause}
              disabled={isAnyPending}
              onPress={() => pauseListing.mutate(item.listing_id)}
            />
          ) : (
            <CustomButton
              type="green"
              isSmall
              textClassName="text-14"
              className="flex-1"
              text={l.btnResume}
              disabled={isAnyPending}
              onPress={() => resumeListing.mutate(item.listing_id)}
            />
          )}
          <CustomButton
            type="red"
            isSmall
            textClassName="text-14"
            className="flex-1"
            text={l.btnDelete}
            disabled={isAnyPending}
            onPress={() => handleDelete(item.listing_id)}
          />
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
      >
        {STATUS_LIST.map(s => (
          // <Tag label={} selected={} onPress={} />
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor:
                status === s
                  ? colors.base.orange.dark
                  : colors.components.tag.default.bg,
              borderWidth: 1,
              borderColor: colors.theme.blue.primary,
            }}
          >
            <CustomText
              style={{
                color:
                  status === s ? colors.base.neutral.whitePrimary
                    : colors.components.tag.default.text,
              }}
              className="text-16 font-medium text-center"
            >
              {statusLabel[s]}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorMessage text={l.errorAPI} />
      ) : (
        <FlatList
          data={ads}
          keyExtractor={item => item.listing_id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90 }}
          ListEmptyComponent={() => (
            <CustomText
              highlight
              className="text-28 text-center"
              style={{ color: colors.theme.blue.primary }}
            >
              {l.emptyAdList}
            </CustomText>
          )}
        />
      )}

      <CustomButton
        text={l.btnNewAd}
        onPress={() => navigate('/(tabs)/ads/createAd')}
        textClassName="text-26"
        className="bottom-4 absolute"
      />
    </ScreenContainer>
  );
}
