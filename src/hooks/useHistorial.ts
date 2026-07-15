import { useEffect, useState } from "react";
import { getHistorial } from "../api/client";
import { useZonaActiva } from "../context/ZonaContext";

export type PuntoHistorial = { timestamp: string; valor: number };

export function useHistorial(sensor: string, rango: string) {
  const { zonaId } = useZonaActiva();
  const [puntos, setPuntos] = useState<PuntoHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = (await getHistorial({
          zona_id: zonaId,
          sensor,
          rango,
        })) as { datos?: PuntoHistorial[] } | PuntoHistorial[];
        const list = Array.isArray(data) ? data : data.datos ?? [];
        if (alive) {
          setPuntos(list);
          setError(null);
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [zonaId, sensor, rango]);

  return { puntos, loading, error };
}
