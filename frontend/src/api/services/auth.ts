import { makePostRequest, makeGetRequest } from '../client';
import { urls } from '../urls';
import { User } from '@/types';

export const authService = {
  login: async (data: any) => {
    return makePostRequest(urls.auth.login, data);
  },
  register: async (data: any) => {
    return makePostRequest(urls.auth.register, data);
  },
  getMe: async () => {
    return makeGetRequest(urls.auth.me, {}, true);
  },
};
