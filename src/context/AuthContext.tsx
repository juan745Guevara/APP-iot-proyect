import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getMe,
  getStoredUser,
  getToken,
  login as loginApi,
  logoutApi,
  setOnUnauthorized,
  type User,
} from "../api/client";
import { TOKEN_KEY, USER_KEY, TENANT_KEY } from "../config";
import { connectSocket, disconnectSocket } from "../socket";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  validating: boolean;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [validating, setValidating] = useState(true);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    disconnectSocket();
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, TENANT_KEY]);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      disconnectSocket();
      setUser(null);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          setValidating(false);
          return;
        }
        const stored = await getStoredUser();
        if (stored) setUser(stored);
        try {
          const me = (await getMe()) as User;
          const next = {
            usuario: me.usuario,
            rol: me.rol,
            tenant_id: me.tenant_id ?? stored?.tenant_id ?? null,
            id: me.id,
          };
          setUser(next);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
          if (next.tenant_id) {
            await AsyncStorage.setItem(TENANT_KEY, next.tenant_id);
          }
          await connectSocket();
        } catch {
          await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
          setUser(null);
        }
      } finally {
        setValidating(false);
      }
    })();
  }, []);

  const login = useCallback(async (usuario: string, password: string) => {
    const data = await loginApi(usuario, password);
    const next: User = {
      usuario: data.usuario,
      rol: data.rol,
      tenant_id: data.tenant_id ?? null,
    };
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
    if (next.tenant_id) {
      await AsyncStorage.setItem(TENANT_KEY, next.tenant_id);
    }
    setUser(next);
    await connectSocket();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      validating,
      login,
      logout,
    }),
    [user, validating, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
}
