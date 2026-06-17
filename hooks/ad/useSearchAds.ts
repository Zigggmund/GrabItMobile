import { AdPreviewType } from '@/types/entities/AdType';
import { SortingAdsType } from '@/types/SortingType';

import { useQuery } from '@tanstack/react-query';

import { mapAd } from '@/hooks/ad/mapAd';

import { PAGE_SIZE } from '@/constants/sizes';

import {
  AdService,
} from '@/services/api/services/adService';
import { SearchListingsRequestDto } from '@/services/api/services/dto/ad.dto';
import { useGetAllCategories } from '@/notUsable/mock-server/hooks/category/useGetAllCategories';

export interface UseSearchAdsParams {
  query?: string;
  categoryId?: string | null;

  minPrice?: number | null;
  maxPrice?: number | null;

  lat?: number | null;
  lon?: number | null;
  radiusKm?: number | null;

  sort_by: SortingAdsType;
  // productType: string;

  page?: number;
  pageSize?: number;
}

export const useSearchAds = (params: UseSearchAdsParams) => {
  const {
    query,
    categoryId,
    minPrice,
    maxPrice,
    lat,
    lon,
    radiusKm,
    // sort_by,
    // productType,
    page = 1,
    pageSize = PAGE_SIZE,
  } = params;

  const apiParams: SearchListingsRequestDto = {
    page,
    sort: params.sort_by,
    page_size: pageSize,
  };
  if (query) apiParams.query = query;
  if (categoryId) apiParams.category_id = categoryId;
  if (minPrice != null && minPrice > 0) apiParams.min_price = minPrice;
  if (maxPrice != null) apiParams.max_price = maxPrice;
  // Геофильтр: все три параметра нужны одновременно
  if (lat != null && lon != null && radiusKm != null) {
    apiParams.lat = lat;
    apiParams.lon = lon;
    apiParams.radius_km = radiusKm;
  }

  // РАСКОММИТИТЬ
  // if (productType) apiParams.product_type = productType;
  return useQuery<{ items: AdPreviewType[]; total: number }>({
    queryKey: ['ads', 'search', apiParams, params.sort_by],
    queryFn: async () => {
      const res = await AdService.searchListings(apiParams);
      return {
        items: res.items.map(mapAd),
        total: res.total,
      };
    },
  });
};
