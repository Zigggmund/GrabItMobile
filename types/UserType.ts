import { MediaType } from '@/types/MediaType';

export interface UserType {
  id: string;
  email: string;
  username: string;
  isCompleted: boolean;
  registrationDate: string;
  // isVerified?: boolean;

  firstName: string;
  lastName: string;
  gender: string | null;
  birthDate: string;
  phoneNumber: string | null;

  // avatar?: MediaType;
  avatar: string | null;
  language: string;
  description: string;
  stats: {
    landlordReviews: number;
    renterReviews: number;
    landlordRating: number | null;
    renterRating: number | null;
    offers: number;
  };
}

export interface UserCardType {
  id: string;
  username: string;
  // avatar?: MediaType;
  avatar: string | null;
  landlordRating: number;
  reviewCount: number;
  phoneNumber: string;
}


//{
//   "data": {
//     "avatar_url": "https://minio.example.com/avatars/abc.jpg",
//     "avg_rating_as_owner": 4.8,
//     "avg_rating_as_renter": 4.9,
//     "birth_date": "1992-06-15",
//     "created_at": "2024-01-15T10:30:00Z",
//     "email": "user@example.com",
//     "first_name": "Александр",
//     "gender": "male",
//     "id": "550e8400-e29b-41d4-a716-446655440000",
//     "last_name": "Беляев",
//     "phone": "+79161234567",
//     "profile_complete": false,
//     "review_count_as_owner": 12,
//     "review_count_as_renter": 5,
//     "username": "alex_92"
//   },
//   "error": "string"
// }