import { useEffect, useState } from "react";
import { actualizarUmbrales, getUmbrales } from "../api/client";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";

export type Umbrales = Record<string, number>;

export function useUmbrales() {
  const { zonaId, tenantId } = useZonaActiva();
  const [umbrales, setUmbrales] = useState<Umbrales>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = (await getUmbrales(zonaId)) as Umbrales;
        if (alive) {
          setUmbrales(data || {});
          setError(null);
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const onUmbrales = (payload: Record<string, unknown>) => {
      if (!matchesTenantZona(payload as { tenant_id?: string; zona_id?: string }, tenantId, zonaId)) {
        return;
      }
      const data = (payload.datos ?? payload) as Umbrales;
      setUmbrales(data);
    };
    const socket = getSocket();
    socket.on("umbrales", onUmbrales);
    return () => {
      alive = false;
      socket.off("umbrales", onUmbrales);
    };
  }, [zonaId, tenantId]);

  const guardar = async (datos: Umbrales) => {
    setSaving(true);
    try {
      await actualizarUmbrales(datos, zonaId);
      setUmbrales(datos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { umbrales, loading, saving, error, guardar, setUmbrales };
}
