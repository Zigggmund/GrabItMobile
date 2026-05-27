import { api } from '@/services/api/instance';
import { unwrap } from '@/services/api/apiUtils';
import { ApiResponse } from '@/services/api/apiResponse';

export class MediaService {
  // Загрузка медиафайла к объявлению
  static async uploadMedia(
    listingId: string,
    fileUri: string,
  ): Promise<{ id: string; url: string }> {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'media.jpg',
    } as unknown as Blob);

    return unwrap(
      await api.post<ApiResponse<{ id: string; url: string }>>(
        `/rent/listings/${listingId}/media`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      ),
    );
  }

  // Удаление медиафайла из объявления (204 No Content)
  static async deleteMedia(
    listingId: string,
    mediaId: string,
  ): Promise<void> {
    await api.delete(`/rent/listings/${listingId}/media/${mediaId}`);
  }

  // Загрузка аватара пользователя (max 4 МБ)
  static async uploadAvatar(fileUri: string): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as unknown as Blob);

    return unwrap(
      await api.post<ApiResponse<{ avatar_url: string }>>(
        '/users/me/avatar',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      ),
    );
  }

  // Сброс аватара к дефолтному (204 No Content)
  static async deleteAvatar(): Promise<void> {
    await api.delete('/users/me/avatar');
  }
}
