import { useCallback, useEffect, useState } from "react";
import { getSensores } from "../api/client";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";

export type Sensores = {
  temperatura: number | null;
  humedad_aire: number | null;
  humedad_suelo: number | null;
  luminosidad: number | null;
};

function mapSensores(data: Record<string, unknown>): Sensores {
  return {
    temperatura: (data.temperatura as number) ?? null,
    humedad_aire: (data.humedad_aire as number) ?? null,
    humedad_suelo: (data.humedad_suelo as number) ?? null,
    luminosidad: (data.luminosidad as number) ?? null,
  };
}

export function useSensores() {
  const { zonaId, tenantId } = useZonaActiva();
  const [sensores, setSensores] = useState<Sensores>({
    temperatura: null,
    humedad_aire: null,
    humedad_suelo: null,
    luminosidad: null,
  });
  const [ultimaLectura, setUltimaLectura] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onSensores = useCallback(
    (payload: Record<string, unknown>) => {
      if (!matchesTenantZona(payload as { tenant_id?: string; zona_id?: string }, tenantId, zonaId)) {
        return;
      }
      const data = (payload.datos ?? payload) as Record<string, unknown>;
      setSensores(mapSensores(data));
      setUltimaLectura(
        (data.ultima_lectura as string) ?? new Date().toISOString()
      );
      setError(null);
      setLoading(false);
    },
    [zonaId, tenantId]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = (await getSensores(zonaId)) as Record<string, unknown>;
        if (alive) onSensores(data);
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Error");
          setLoading(false);
        }
      }
    })();
    const socket = getSocket();
    socket.on("sensores", onSensores);
    return () => {
      alive = false;
      socket.off("sensores", onSensores);
    };
  }, [zonaId, tenantId, onSensores]);

  return { sensores, ultimaLectura, loading, error, zonaId };
}
