import { MyAdStatus } from '@/types/entities/AdType';

import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';

import { mapAd } from '@/hooks/ad/mapAd';
import { useDeleteListing } from '@/hooks/ad/useDeleteListing';
import { useGetMyAds } from '@/hooks/ad/useGetMyAds';
import { usePauseListing } from '@/hooks/ad/usePauseListing';
import { useResumeListing } from '@/hooks/ad/useResumeListing';
import { useHistory } from '@/hooks/useHistory';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import ErrorMessage from '@/components/common/ErrorMessage';
import GreyBlock from '@/components/common/GreyBlock';
import { Tag } from '@/components/common/Tag';
import BigAd from '@/components/items/ads/BigAd';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';
import { BIG_AD_WIDTH } from '@/constants/sizes';

import { AdResponseDto } from '@/services/api/services/dto/ad.dto';

export default function MyAdsPage() {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const { navigate } = useHistory();

  const [status, setStatus] = useState<MyAdStatus>('active');
  const [page, setPage] = useState(1);
  const [allAds, setAllAds] = useState<AdResponseDto[]>([]);

  const { data, isLoading, isError, isFetching } = useGetMyAds(status, page);

  useEffect(() => {
    setPage(1);
    setAllAds([]);
  }, [status]);

  useEffect(() => {
    if (!data?.items) return;
    setAllAds(prev => {
      if (page === 1) return data.items;
      const existingIds = new Set(prev.map(a => a.listing_id));
      return [...prev, ...data.items.filter(a => !existingIds.has(a.listing_id))];
    });
  }, [data]);

  const total = data?.total ?? 0;

  const pauseListing = usePauseListing();
  const resumeListing = useResumeListing();
  const deleteListing = useDeleteListing();

  const isAnyPending =
    pauseListing.isPending ||
    resumeListing.isPending ||
    deleteListing.isPending;

  // const statusLabel: Record<MyAdStatus, string> = {
  //   active: l.active,
  //   paused: l.paused,
  //   deleted: l.deleted,
  // };

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

  const renderItem = ({
    item,
    index,
  }: {
    item: AdResponseDto;
    index: number;
  }) => (
    <View>
      <View
        className={'gap-x-2 px-2 gap-y-3 flex-row  justify-center flex-wrap'}
      >
        <Tag
          isSmall
          label={l.active}
          selected={status == 'active'}
          onPress={() => setStatus('active')}
        />
        <Tag
          isSmall
          label={l.paused}
          selected={status == 'paused'}
          onPress={() => setStatus('paused')}
        />
        <Tag
          isSmall
          label={l.deleted}
          selected={status == 'deleted'}
          onPress={() => setStatus('deleted')}
        />
      </View>
      <CustomText
        className={'text-14'}
        style={{ color: colors.theme.blue.bright }}
      >
        {l.adsFound}: {total}
      </CustomText>
      <GreyBlock index={index} className={'gap-4'}>
        <BigAd width={BIG_AD_WIDTH} ad={mapAd(item)} />
        {item.status !== 'deleted' && (
          <View className={'flex-row gap-12'}>
            <CustomButton
              type="red"
              iconSize={20}
              iconSource={icons.trash}
              disabled={isAnyPending}
              onPress={() => handleDelete(item.listing_id)}
            />
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
              type={'secondary'}
              iconSize={20}
              iconSource={icons.edit}
              onPress={() =>
                navigate({
                  pathname: '/(tabs)/ads/edit/[id]',
                  params: { id: String(item.listing_id) },
                })
              }
            />
          </View>
        )}
      </GreyBlock>
    </View>
  );

  return (
    <ScreenContainer>
      <View
        className={'gap-x-2 px-2 gap-y-3 flex-row  justify-center flex-wrap mb-4'}
      >
        <Tag
          isSmall
          label={l.active}
          selected={status == 'active'}
          onPress={() => setStatus('active')}
        />
        <Tag
          isSmall
          label={l.paused}
          selected={status == 'paused'}
          onPress={() => setStatus('paused')}
        />
        <Tag
          isSmall
          label={l.deleted}
          selected={status == 'deleted'}
          onPress={() => setStatus('deleted')}
        />
        {/*{STATUS_LIST.map(s => (*/}
        {/*  <TouchableOpacity*/}
        {/*    key={s}*/}
        {/*    onPress={() => setStatus(s)}*/}
        {/*    style={{*/}
        {/*      flex: 1,*/}
        {/*      paddingVertical: 8,*/}
        {/*      borderRadius: 8,*/}
        {/*      alignItems: 'center',*/}
        {/*      backgroundColor:*/}
        {/*        status === s*/}
        {/*          ? colors.base.orange.dark*/}
        {/*          : colors.components.tag.default.bg,*/}
        {/*      borderWidth: 1,*/}
        {/*      borderColor: colors.theme.blue.primary,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <CustomText*/}
        {/*      style={{*/}
        {/*        color:*/}
        {/*          status === s ? colors.base.neutral.whitePrimary*/}
        {/*            : colors.components.tag.default.text,*/}
        {/*      }}*/}
        {/*      className="text-16 font-medium text-center"*/}
        {/*    >*/}
        {/*      {statusLabel[s]}*/}
        {/*    </CustomText>*/}
        {/*  </TouchableOpacity>*/}
        {/*))}*/}
      </View>

      {isLoading && allAds.length === 0 ? (
        <ActivityIndicator />
      ) : isError ? (
        <ErrorMessage text={l.errorAPI} />
      ) : (
        <FlatList
          data={allAds}
          keyExtractor={item => item.listing_id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 90 }}
          onEndReached={() => {
            if (allAds.length < total && !isFetching) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (isFetching ? <ActivityIndicator /> : null)}
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
        type={'highlighted'}
        text={l.btnNewAd}
        onPress={() => navigate('/(tabs)/ads/createAd')}
        textClassName="text-26"
        className="bottom-4 absolute"
      />
    </ScreenContainer>
  );
}
