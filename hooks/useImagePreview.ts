import { useState } from 'react';

export const useImagePreview = () => {
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const openPreview = (uri?: string | null) => {
    if (!uri) return;

    setImageUri(uri);
    setVisible(true);
  };

  const closePreview = () => {
    setVisible(false);
  };

  return {
    visible,
    imageUri,
    openPreview,
    closePreview,
  };
}