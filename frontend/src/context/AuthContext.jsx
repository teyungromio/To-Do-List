import { createContext, useContext, useMemo, useState } from "react";
import { api, clearAccessToken, setAccessToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function login(email, password) {
    setAuthLoading(true);
    try {
      const data = await api.login({ email, password });
      setAccessToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setAuthLoading(false);
    }
  }

  async function register(name, email, password) {
    setAuthLoading(true);
    try {
      const data = await api.register({ name, email, password });
      setAccessToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    clearAccessToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, authLoading, login, register, logout }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
