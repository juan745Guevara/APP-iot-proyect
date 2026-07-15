import { useCallback, useEffect, useState } from "react";
import { getActuadores, toggleActuador } from "../api/client";
import { ESTADO_INICIAL_ACTUADORES, type EstadoActuador } from "../constants/invernadero";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";

export function useActuadores() {
  const { zonaId, tenantId } = useZonaActiva();
  const [actuadores, setActuadores] = useState<Record<string, EstadoActuador>>({
    ...ESTADO_INICIAL_ACTUADORES,
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onActuadores = useCallback(
    (payload: Record<string, unknown>) => {
      if (!matchesTenantZona(payload as { tenant_id?: string; zona_id?: string }, tenantId, zonaId)) {
        return;
      }
      const data = (payload.datos ?? payload) as Record<string, EstadoActuador>;
      setActuadores((prev) => ({ ...prev, ...data }));
      setLoading(false);
      setError(null);
    },
    [zonaId, tenantId]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = (await getActuadores(zonaId)) as Record<string, unknown>;
        if (alive) onActuadores(data);
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Error");
          setLoading(false);
        }
      }
    })();
    const socket = getSocket();
    socket.on("actuadores", onActuadores);
    return () => {
      alive = false;
      socket.off("actuadores", onActuadores);
    };
  }, [zonaId, tenantId, onActuadores]);

  const toggle = async (id: string) => {
    const actual = actuadores[id] === "ON" ? "ON" : "OFF";
    const next = actual === "ON" ? "OFF" : "ON";
    setBusy(id);
    setError(null);
    try {
      await toggleActuador(id, next, zonaId);
      setActuadores((prev) => ({ ...prev, [id]: next }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(null);
    }
  };

  return { actuadores, loading, busy, error, toggle };
}
