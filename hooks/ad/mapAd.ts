import { AdDetailsType, AdPreviewType } from '@/types/entities/AdType';
import { MediaType } from '@/types/MediaType';

import { AdResponseDto } from '@/services/api/services/dto/ad.dto';
import { PublicUserResponseDto } from '@/services/api/services/dto/user.dto';

const PLACEHOLDER_IMAGE: MediaType = { id: 0, url: '' };

export const mapAd = (dto: AdResponseDto): AdPreviewType => {
  const firstMedia = dto.media?.[0];

  return {
    id: dto.listing_id,
    title: dto.title,
    description: dto.description,
    rub_per_hour: dto.price_per_hour,
    rating: dto.review_count === 0 ? null : dto.avg_rating,
    reviewCount: dto.review_count,
    address: dto.address ?? '',
    // productType: 'product',
    categoryId: String(dto.category_id),
    previewImage: firstMedia
      ? { id: 0, url: firstMedia.url }
      : PLACEHOLDER_IMAGE,
    // createdDate: dto.created_at,
  };
};

export const mapFullAd = (dto: AdResponseDto, owner: PublicUserResponseDto): AdDetailsType => {
  return {
    ...mapAd(dto),
    lat: dto.lat,
    lon: dto.lon,
    media: dto.media.map((m, i) => ({ id: i, url: m.url })),
    createdDate: dto.created_at,
    specifications: dto.attributes,
    landlord: {
      id: owner.id,
      username: owner.username,
      avatar: owner.avatar_url,
      landlordRating: owner.avg_rating_as_owner,
      reviewCount: owner.review_count_as_owner,
      phoneNumber: null,
    },
    bookingCalendar: '',
    reviews: [],
    myBooking: null,
  };
};
