import { useCallback, useEffect, useState } from "react";
import { getAlertas, resolverAlerta } from "../api/client";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";

export type Alerta = {
  id: number;
  tipo?: string;
  mensaje?: string;
  sensor?: string;
  valor?: number;
  creada_en?: string;
  resuelta?: boolean;
  zona_id?: string;
};

export function useAlertas({ soloActivas = false } = {}) {
  const { zonaId, tenantId } = useZonaActiva();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getAlertas({
        zona_id: zonaId,
        activas: soloActivas,
      })) as { alertas?: Alerta[] } | Alerta[];
      const list = Array.isArray(data) ? data : data.alertas ?? [];
      setAlertas(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [zonaId, soloActivas]);

  useEffect(() => {
    cargar();
    const onAlerta = (payload: Record<string, unknown>) => {
      if (!matchesTenantZona(payload as { tenant_id?: string; zona_id?: string }, tenantId, zonaId)) {
        return;
      }
      cargar();
    };
    const socket = getSocket();
    socket.on("alerta", onAlerta);
    return () => {
      socket.off("alerta", onAlerta);
    };
  }, [cargar, zonaId, tenantId]);

  const resolver = async (id: number) => {
    await resolverAlerta(id);
    setAlertas((prev) =>
      soloActivas ? prev.filter((a) => a.id !== id) : prev.map((a) => (a.id === id ? { ...a, resuelta: true } : a))
    );
  };

  return { alertas, loading, error, resolver, recargar: cargar };
}
