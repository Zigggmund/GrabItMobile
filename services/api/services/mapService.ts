import { YANDEX_API_KEY } from '@/constants/config';

export class MapService {
  // Получение строки адреса по координатам
  static async getAddress(lat: number, lon: number): Promise<string> {
    try {
      const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_API_KEY}&format=json&geocode=${lon},${lat}&lang=ru_RU`;
      const res = await fetch(url);
      const data = await res.json();

      const feature = data.response.GeoObjectCollection.featureMember[0];
      return feature?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text || '';
    } catch (error) {
      console.error('Ошибка геокодинга Яндекс:', error);
      return '';
    }
  }
}
