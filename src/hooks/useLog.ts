import { useCallback, useEffect, useState } from "react";
import { getLog } from "../api/client";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";

export type LogItem = {
  id?: number;
  actuador?: string;
  estado?: string;
  origen?: string;
  creado_en?: string;
  timestamp?: string;
};

export function useLog() {
  const { zonaId, tenantId } = useZonaActiva();
  const [items, setItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getLog({ zona_id: zonaId })) as
        | { log?: LogItem[]; items?: LogItem[] }
        | LogItem[];
      const list = Array.isArray(data)
        ? data
        : data.log ?? data.items ?? [];
      setItems(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [zonaId]);

  useEffect(() => {
    cargar();
    const onLog = (payload: Record<string, unknown>) => {
      if (
        !matchesTenantZona(
          payload as { tenant_id?: string; zona_id?: string },
          tenantId,
          zonaId
        )
      ) {
        return;
      }
      cargar();
    };
    const socket = getSocket();
    socket.on("log_accion", onLog);
    return () => {
      socket.off("log_accion", onLog);
    };
  }, [cargar, zonaId, tenantId]);

  return { items, loading, error, recargar: cargar };
}
