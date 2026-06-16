import { makePostRequest, makeGetRequest } from "../client";
import { urls } from "../urls";
import { LoginPayload, RegisterPayload } from "@/types/auth";

export const authService = {
  login: async (data: LoginPayload) => {
    return makePostRequest(urls.auth.login, data);
  },
  register: async (data: RegisterPayload) => {
    return makePostRequest(urls.auth.register, data);
  },
  getMe: async () => {
    return makeGetRequest(urls.auth.me, {}, true);
  },
};
