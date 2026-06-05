import { useState } from 'react';

export const useMediaPreview = () => {
  const [visible, setVisible] = useState(false);
  const [uri, setUri] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

  const openPreview = (uri?: string | null, type: 'photo' | 'video' = 'photo') => {
    if (!uri) return;
    setUri(uri);
    setMediaType(type);
    setVisible(true);
  };

  const closePreview = () => setVisible(false);

  return { visible, uri, mediaType, openPreview, closePreview };
};
