export class MapService {
  static async getAddress(lat: number, lon: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'GrabItApp/1.0', // ОБЯЗАТЕЛЬНО
        },
      });

      const data = await res.json();

      return data.display_name || '';
    } catch (error) {
      console.error('Ошибка геокодинга OSM:', error);
      return '';
    }
  }
}
