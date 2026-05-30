import { AxiosResponse } from 'axios';

import { ApiResponse } from '@/services/api/apiResponse';

// Кастомный класс ошибки для бизнес-ошибок от бэкенда.
//  Бросается когда сервер вернул HTTP 2xx, но ok: false в теле ответа.
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Распаковывает ответ бэкенда формата { ok, data } | { ok: false, error }.
// - ok: true  → возвращает data (тип T)
// - ok: false → бросает ApiError с текстом ошибки от сервера
// Использовать для всех методов сервисов, кроме void-запросов (DELETE 204 и т.п.).

export function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
  if (!res.data.ok) {
    throw new ApiError(res.data.error);
  }
  return res.data.data;
}
