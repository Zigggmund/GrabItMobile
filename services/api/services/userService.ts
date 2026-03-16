import { UserType } from '@/types/UserType';

import { AxiosResponse } from 'axios';

import { api } from '@/services/api/instance';

export class UserService {
  // получение дынных текущего юзера по токену
  static async infoUser(): Promise<
    // AxiosResponse<{ data: UserType } & { message: string }>
    AxiosResponse<UserType>
  > {
    return api.get('/user/1');
  }

  // получение другого юзера по id
  static async getUserById(
    userId: number | string,
  ): Promise<AxiosResponse<UserType>> {
    console.log('Getting user by id attempt:', { userId });
    return api.get(`/user/${userId}`);
  }
}
