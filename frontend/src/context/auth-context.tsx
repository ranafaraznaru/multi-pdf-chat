"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/auth";
import { User } from "@/types";
import { LoginPayload, RegisterPayload } from "@/types/auth";
import {
  clearAuth,
  getStoredUser,
  getToken,
  setAuth,
} from "@/utils/auth";
import { toast } from "react-hot-toast";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload, redirectTo?: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await authService.getMe();
      setUser(response.data.data);
      localStorage.setItem("pdf_user", JSON.stringify(response.data.data));
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const stored = getStoredUser();
      if (stored && getToken()) {
        setUser(stored);
        await refreshUser();
      }
      setIsLoading(false);
    };
    void init();
  }, [refreshUser]);

  const login = useCallback(
    async (payload: LoginPayload, redirectTo = "/dashboard") => {
      const response = await authService.login(payload);
      const { access_token, id, name, email } = response.data.data;
      const authUser: User = { id, name, email };
      setAuth(access_token, authUser);
      setUser(authUser);
      toast.success("Welcome back!");
      router.push(redirectTo);
    },
    [router],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authService.register(payload);
      toast.success("Account created. Sign in to continue.");
      router.push("/auth/login");
    },
    [router],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    toast.success("Signed out");
    router.push("/auth/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user && getToken()),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
