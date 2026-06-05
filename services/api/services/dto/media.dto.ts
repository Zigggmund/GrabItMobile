export interface MediaUploadDTO {
  id: string;
  file: string;
  mimeType?: string;
  sort_order: number;
}

export interface MediaDeleteDTO {
  id: string;
  mediaId: string;
}
