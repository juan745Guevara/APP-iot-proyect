import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ZONA_DEFAULT, ZONA_KEY } from "../config";
import { getStoredTenantId } from "../api/client";
import { useAuth } from "./AuthContext";

type ZonaContextValue = {
  zonaId: string;
  setZonaId: (id: string) => void;
  tenantId: string | null;
};

const ZonaContext = createContext<ZonaContextValue | null>(null);

export function ZonaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [zonaId, setZonaIdState] = useState(ZONA_DEFAULT);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(ZONA_KEY);
      if (saved) setZonaIdState(saved);
      const tid = user?.tenant_id ?? (await getStoredTenantId());
      setTenantId(tid);
    })();
  }, [user?.tenant_id]);

  const setZonaId = (id: string) => {
    setZonaIdState(id);
    AsyncStorage.setItem(ZONA_KEY, id).catch(() => undefined);
  };

  const value = useMemo(
    () => ({ zonaId, setZonaId, tenantId }),
    [zonaId, tenantId]
  );

  return <ZonaContext.Provider value={value}>{children}</ZonaContext.Provider>;
}

export function useZonaActiva() {
  const ctx = useContext(ZonaContext);
  if (!ctx) throw new Error("useZonaActiva fuera de ZonaProvider");
  return ctx;
}
