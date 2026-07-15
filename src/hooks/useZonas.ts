import { useCallback, useEffect, useState } from "react";
import { getZonas } from "../api/client";
import { getSocket } from "../socket";
import { useZonaActiva } from "../context/ZonaContext";

export type Zona = {
  id: string;
  nombre?: string;
  activa?: boolean;
  estado?: {
    conectado?: boolean;
    ultima_vez?: string | null;
  };
};

export function useZonas() {
  const { tenantId } = useZonaActiva();
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getZonas()) as Zona[];
      setZonas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const onEstado = () => cargar();
    const socket = getSocket();
    socket.on("estado_zonas", onEstado);
    return () => {
      socket.off("estado_zonas", onEstado);
    };
  }, [cargar, tenantId]);

  return { zonas, loading, error, recargar: cargar };
}
