import { api } from '@/services/api/instance';
import { UserResponseDto } from '@/services/api/services/dto/user.dto';

export class UserService {
  // получение дынных текущего юзера по токену
  static async infoUser() {
    console.log('Getting current user attempt');

    return api.get<{ data: UserResponseDto }>('/users/me');
  }

  // получение другого юзера по username
  static async getUserByUsername(username: string) {
    console.log('Getting user by id attempt:', { username: username });

    return api.get<{ data: UserResponseDto }>(`/users/${username}`);
  }

  // получение пользователя по userId
  static async getUserById(userId: string) {
    console.log('Getting user by id attempt:', { userId: userId });

    return api.get<{ data: UserResponseDto }>(`/users/${userId}`);
  }
}
