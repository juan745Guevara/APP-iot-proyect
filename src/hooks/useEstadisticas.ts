import { useEffect, useState } from "react";
import { getEstadisticasSemana, getPrediccion } from "../api/client";
import { useZonaActiva } from "../context/ZonaContext";

export function useEstadisticas() {
  const { zonaId } = useZonaActiva();
  const [semana, setSemana] = useState<Record<string, unknown> | null>(null);
  const [prediccion, setPrediccion] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [s, p] = await Promise.all([
          getEstadisticasSemana(zonaId),
          getPrediccion("temperatura", zonaId),
        ]);
        if (alive) {
          setSemana(s as Record<string, unknown>);
          setPrediccion(p as Record<string, unknown>);
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
  }, [zonaId]);

  return { semana, prediccion, loading, error };
}
