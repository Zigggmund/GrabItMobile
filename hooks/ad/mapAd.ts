import { AdDetailsType, AdPreviewType } from '@/types/entities/AdType';
import { MediaType } from '@/types/MediaType';

import { AdResponseDto } from '@/services/api/services/dto/ad.dto';
import { PublicUserResponseDto } from '@/services/api/services/dto/user.dto';

const PLACEHOLDER_IMAGE: MediaType = { id: '', url: '' };

export const mapAd = (dto: AdResponseDto): AdPreviewType => {
  const sortedMedia = [...(dto.media ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const firstMedia = sortedMedia[0];

  return {
    id: dto.listing_id,
    title: dto.title,
    description: dto.description,
    rub_per_hour: dto.price_per_hour,
    rating: dto.review_count === 0 ? null : dto.avg_rating,
    reviewCount: dto.review_count,
    address: dto.address ?? '',
    lat: dto.lat || undefined,
    lon: dto.lon || undefined,
    ownerIsPremium: dto.owner_is_premium,
    categoryId: String(dto.category_id),
    previewImage: firstMedia
      ? {
          id: firstMedia.id,
          url: firstMedia.url,
          mediaType: firstMedia.media_type === 'video' ? 'video' : 'photo',
        }
      : PLACEHOLDER_IMAGE,
  };
};

export const mapFullAd = (
  dto: AdResponseDto,
  owner: PublicUserResponseDto,
): AdDetailsType => {
  const mappedAd = mapAd(dto);
  const allMedia = [...(dto.media ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(m => ({
      id: m.id,
      url: m.url,
      mediaType: m.media_type === 'video' ? ('video' as const) : ('photo' as const),
    }));

  return {
    ...mapAd(dto),
    lat: dto.lat,
    lon: dto.lon,
    quantity: dto.quantity,
    bufferHours: dto.buffer_hours,
    media: allMedia,
    createdDate: dto.created_at,
    specifications: dto.attributes,
    landlord: {
      id: owner.id,
      username: owner.username,
      avatar: owner.avatar_url,
      landlordRating: owner.avg_rating_as_owner,
      reviewCount: owner.review_count_as_owner,
      phoneNumber: null,
      isPremium: owner.is_premium,
    },
    bookingCalendar: '',
    reviews: [],
    myBooking: null,
  };
};
