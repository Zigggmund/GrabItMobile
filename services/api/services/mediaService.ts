import { ApiResponse } from '@/services/api/apiResponse';
import { unwrap } from '@/services/api/apiUtils';
import { api } from '@/services/api/instance';

interface UploadMediaResp {
  media_id: string;
  url: string;
  media_type: 'photo' | 'video';
  sort_order: number;
}

export class MediaService {
  static async uploadMedia(
    listingId: string,
    fileUri: string,
    mimeType: string = 'image/jpeg',
    sortOrder: number = 0,
  ): Promise<{ id: string; url: string }> {
    if (mimeType.startsWith('video')) {
      return MediaService.uploadVideo(listingId, fileUri, sortOrder);
    }
    return MediaService.uploadPhoto(listingId, fileUri, sortOrder);
  }

  private static async uploadPhoto(
    listingId: string,
    fileUri: string,
    sortOrder: number,
  ): Promise<{ id: string; url: string }> {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as unknown as Blob);
    formData.append('sort_order', String(sortOrder));

    const res = await unwrap(
      await api.post<ApiResponse<UploadMediaResp>>(
        `/rent/listings/${listingId}/media/photo`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      ),
    );
    return { id: res.media_id, url: res.url };
  }

  private static async uploadVideo(
    listingId: string,
    fileUri: string,
    sortOrder: number,
  ): Promise<{ id: string; url: string }> {
    // Step 1: get presigned upload URL
    const { upload_url, object_key } = await unwrap(
      await api.post<ApiResponse<{ upload_url: string; object_key: string }>>(
        `/rent/listings/${listingId}/media/video/upload-url`,
      ),
    );

    // Step 2: upload binary directly to S3 presigned URL
    const fileResponse = await fetch(fileUri);
    const blob = await fileResponse.blob();
    const uploadResp = await fetch(upload_url, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'video/mp4' },
    });
    if (!uploadResp.ok) {
      throw new Error(`Video upload failed: ${uploadResp.status}`);
    }

    // Step 3: confirm upload
    const res = await unwrap(
      await api.post<ApiResponse<UploadMediaResp>>(
        `/rent/listings/${listingId}/media/video/confirm`,
        { object_key, sort_order: sortOrder },
      ),
    );
    return { id: res.media_id, url: res.url };
  }

  static async deleteMedia(listingId: string, mediaId: string): Promise<void> {
    unwrap(await api.delete(`/rent/listings/${listingId}/media/${mediaId}`));
  }

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

  static async deleteAvatar(): Promise<void> {
    unwrap(await api.delete('/users/me/avatar'));
  }
}
