export class MapService {
  // Получение строки адреса по координатам
  static async getAddress(
    lat: number,
    lon: number,
  ): Promise<string> {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`,
    );
    const data = await res.json();
    return data.display_name;
  }
}
