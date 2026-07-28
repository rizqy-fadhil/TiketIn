"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN_KEY = "tiketin_token";
const STORAGE_USER_KEY = "tiketin_user";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // isLoading = true selama kita cek localStorage saat pertama load,
  // mencegah flickering (navbar menampilkan "Login" sebentar sebelum hydrate)
  const [isLoading, setIsLoading] = useState(true);

  // ── Hydrate dari localStorage saat mount ──────────────────────────────────
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
      }
    } catch {
      // localStorage tidak tersedia (mis. SSR, private mode) — abaikan
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Login: simpan ke state + localStorage ─────────────────────────────────
  const login = useCallback((token: string, userData: AuthUser) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  }, []);

  // ── Logout: hapus dari state + localStorage ───────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  }
  return ctx;
}
