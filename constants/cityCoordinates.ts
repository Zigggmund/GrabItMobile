// Координаты центров городов для геофильтра поиска.
// Используются когда пользователь выбирает режим "Город" вместо ручной точки на карте.
// Источник: приблизительные координаты центра каждого города.

import { CityKey } from '@/constants/cities';

export interface CityCoords {
  lat: number;
  lon: number;
}

// Радиус поиска по умолчанию при выборе города (км)
export const DEFAULT_CITY_RADIUS_KM = 25;

export const cityCoordinates: Record<CityKey, CityCoords> = {
  moscow: { lat: 55.7558, lon: 37.6173 },
  saint_petersburg: { lat: 59.9343, lon: 30.3351 },
  novosibirsk: { lat: 55.0084, lon: 82.9357 },
  yekaterinburg: { lat: 56.8389, lon: 60.6057 },
  kazan: { lat: 55.8304, lon: 49.0661 },
  nizhny_novgorod: { lat: 56.2965, lon: 43.9361 },
  krasnoyarsk: { lat: 56.0153, lon: 92.8932 },
  chelyabinsk: { lat: 55.1644, lon: 61.4368 },
  ufa: { lat: 54.7388, lon: 55.9721 },
  samara: { lat: 53.2001, lon: 50.15 },
  krasnodar: { lat: 45.0355, lon: 38.9753 },
  rostov_on_don: { lat: 47.2357, lon: 39.7015 },
  voronezh: { lat: 51.6683, lon: 39.1919 },
  volgograd: { lat: 48.7194, lon: 44.5018 },
  perm: { lat: 58.0105, lon: 56.2502 },
  vladivostok: { lat: 43.1155, lon: 131.8855 },
  yaroslavl: { lat: 57.6261, lon: 39.8845 },
  sevastopol: { lat: 44.6054, lon: 33.5221 },
  stavropol: { lat: 45.0428, lon: 41.9734 },
  tomsk: { lat: 56.4977, lon: 84.9744 },
  kemerovo: { lat: 55.3904, lon: 86.0479 },
  naberezhnye_chelny: { lat: 55.7366, lon: 52.4139 },
  orenburg: { lat: 51.7679, lon: 55.0974 },
  novokuznetsk: { lat: 53.7557, lon: 87.1099 },
  balashikha: { lat: 55.7964, lon: 37.9382 },
  ryazan: { lat: 54.6296, lon: 39.7418 },
  astrakhan: { lat: 46.3478, lon: 48.034 },
  penza: { lat: 53.1959, lon: 45.0183 },
  lipetsk: { lat: 52.6088, lon: 39.5996 },
  kaliningrad: { lat: 54.7104, lon: 20.4522 },
  kirov: { lat: 58.5965, lon: 49.6562 },
  tula: { lat: 54.1961, lon: 37.6182 },
  ulan_ude: { lat: 51.8272, lon: 107.6062 },
  sochi: { lat: 43.5992, lon: 39.7257 },
  kursk: { lat: 51.7304, lon: 36.1927 },
  surgut: { lat: 61.2503, lon: 73.4325 },
  tver: { lat: 56.8587, lon: 35.9176 },
  magnitogorsk: { lat: 53.4078, lon: 59.0572 },
  bryansk: { lat: 53.2521, lon: 34.3717 },
  vladimir: { lat: 56.129, lon: 40.4068 },
  belgorod: { lat: 50.5975, lon: 36.5876 },
  nizhny_tagil: { lat: 57.91, lon: 59.981 },
  arkhangelsk: { lat: 64.5401, lon: 40.5433 },
  saransk: { lat: 54.1877, lon: 45.1831 },
  chita: { lat: 52.0341, lon: 113.4985 },
  ulyanovsk: { lat: 54.3282, lon: 48.3866 },
  cheboksary: { lat: 56.1439, lon: 47.2489 },
};
