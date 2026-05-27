import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';
import {
  UserChangingDto,
  UserResponseDto,
} from '@/services/api/services/dto/user.dto';

export class UserService {
  // Профиль текущего пользователя
  static async getMe(): Promise<UserResponseDto> {
    return unwrap(await api.get<ApiResponse<UserResponseDto>>('/users/me'));
  }

  // Обновление изменяемых полей профиля
  static async changeMe(payload: UserChangingDto): Promise<UserResponseDto> {
    return unwrap(
      await api.put<ApiResponse<UserResponseDto>>('/users/me/profile', payload),
    );
  }

  // Мягкое удаление аккаунта (soft delete, 204)
  static async deleteMe(): Promise<void> {
    await api.delete('/users/me');
  }

  // Публичный профиль по username
  static async getUserByUsername(username: string): Promise<UserResponseDto> {
    return unwrap(
      await api.get<ApiResponse<UserResponseDto>>(`/users/${username}`),
    );
  }

  // Проверка доступности username
  static async checkUsername(
    username: string,
  ): Promise<{ available: boolean }> {
    const res = await api.get<ApiResponse<{ available: boolean }>>(
      `/users/username-check?q=${encodeURIComponent(username)}`,
    );
    return unwrap(res);
  }

  // Смена языка интерфейса
  static async changeLanguage(language: string): Promise<void> {
    await api.put(`/users/me/language/`, language);
  }
}
