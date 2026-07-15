import { useCallback, useEffect, useState } from "react";
import {
  actualizarRiego,
  crearRiego,
  eliminarRiego,
  getRiegos,
} from "../api/client";
import { useZonaActiva } from "../context/ZonaContext";

export type Riego = {
  id: number;
  hora?: string;
  duracion_min?: number;
  dias?: string[] | string;
  activo?: boolean;
  zona_id?: string;
};

export function useRiegos() {
  const { zonaId } = useZonaActiva();
  const [riegos, setRiegos] = useState<Riego[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await getRiegos(zonaId)) as { riegos?: Riego[] };
      setRiegos(res.riegos ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setRiegos([]);
    } finally {
      setLoading(false);
    }
  }, [zonaId]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const crear = async (datos: Record<string, unknown>) => {
    await crearRiego({ ...datos, zona_id: zonaId });
    await recargar();
  };

  const actualizar = async (id: number, datos: Record<string, unknown>) => {
    await actualizarRiego(id, datos);
    await recargar();
  };

  const eliminar = async (id: number) => {
    await eliminarRiego(id);
    await recargar();
  };

  return { riegos, loading, error, crear, actualizar, eliminar, recargar };
}
