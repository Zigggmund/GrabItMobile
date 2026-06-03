// колво запросов в день: 5к
export class MapService {
  static getAddress = async (lat: number, lon: number): Promise<string> => {
    try {
      const url =
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';

      console.log('DADATA TOKEN EXISTS:', !!process.env.EXPO_PUBLIC_DADATA_API_KEY);
      console.log('SENDING COORDINATES:', { lat, lon });

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${process.env.EXPO_PUBLIC_DADATA_API_KEY}`,
        },
        body: JSON.stringify({ lat, lon, count: 1 }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Dadata API Error! Status: ${res.status}. Response: ${errorText}`,
        );
        return '';
      }

      const data = await res.json();
      console.log('Dadata Response Data:', data);

      if (data.suggestions && data.suggestions.length > 0) {
        return data.suggestions[0].value;
      }

      return '';
    } catch (error) {
      console.error('Ошибка геокодинга Dadata:', error);
      return '';
    }
  };
}

// nominatim сильно ОГРАНИЧИВАЕТ количество запросов
// export class MapService {
//   static async getAddress(lat: number, lon: number): Promise<string> {
//     try {
//       const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`;
//
//       const res = await fetch(url, {
//         headers: {
//           'User-Agent': 'GrabItApp/1.0', // ОБЯЗАТЕЛЬНО
//         },
//       });
//
//       const data = await res.json();
//
//       return data.display_name || '';
//     } catch (error) {
//       console.error('Ошибка геокодинга OSM:', error);
//       return '';
//     }
//   }
// }
