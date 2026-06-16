import Cookies from "js-cookie";
import { User } from "@/types";

const TOKEN_KEY = "pdf_token";
const USER_KEY = "pdf_user";

export function normalizeToken(token: string): string {
  return token.startsWith("Bearer ") ? token.slice(7) : token;
}

export function setAuth(token: string, user: User): void {
  Cookies.set(TOKEN_KEY, normalizeToken(token), { expires: 7, sameSite: "lax" });
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
