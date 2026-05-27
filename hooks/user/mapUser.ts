import { UserType } from '@/types/entities/UserType';

import { UserResponseDto } from '@/services/api/services/dto/user.dto';

export const mapUser = (dto: UserResponseDto): UserType => {
  return {
    id: dto.id,
    email: dto.email,
    username: dto.username,

    isCompleted: dto.profile_complete,
    registrationDate: dto.created_at,

    firstName: dto.first_name,
    lastName: dto.last_name,
    gender: dto.gender,
    birthDate: dto.birth_date,
    phoneNumber: dto.phone,

    avatar: dto.avatar_url,
    language: dto.language,

    stats: {
      landlordReviews: dto.review_count_as_owner,
      renterReviews: dto.review_count_as_renter,
      landlordRating: dto.avg_rating_as_owner,
      renterRating: dto.avg_rating_as_renter,
      offers: 0,
    },
  };
};
