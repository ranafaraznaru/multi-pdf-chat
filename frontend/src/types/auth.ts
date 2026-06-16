import { User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseData extends User {
  access_token: string;
}

export interface AuthResponse {
  message: string;
  data: AuthResponseData;
}

export interface MeResponse {
  data: User;
}
