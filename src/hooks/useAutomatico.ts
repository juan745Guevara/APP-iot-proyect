import { useCallback, useEffect, useState } from "react";
import {
  getAutomatico,
  guardarAutomatico,
  setModoAutomatico,
} from "../api/client";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";

const DEFAULT = {
  ventilador: {
    modo: "manual",
    activar_si: { sensor: "temperatura", operador: ">=", valor: 36 },
    desactivar_si: { sensor: "temperatura", operador: "<", valor: 33 },
  },
  bomba: {
    modo: "manual",
    activar_si: { sensor: "humedad_suelo", operador: "<=", valor: 30 },
    desactivar_si: { sensor: "humedad_suelo", operador: ">", valor: 40 },
  },
};

export type AutoConfig = typeof DEFAULT;

export function useAutomatico() {
  const { zonaId, tenantId } = useZonaActiva();
  const [config, setConfig] = useState<AutoConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = (await getAutomatico(zonaId)) as {
          config?: AutoConfig;
        } & AutoConfig;
        if (alive) {
          setConfig({ ...DEFAULT, ...(data.config ?? data) });
          setError(null);
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const onAutomatico = (payload: Record<string, unknown>) => {
      if (
        !matchesTenantZona(
          payload as { tenant_id?: string; zona_id?: string },
          tenantId,
          zonaId
        )
      ) {
        return;
      }
      const data = (payload.config ?? payload) as AutoConfig;
      setConfig({ ...DEFAULT, ...data });
    };
    const socket = getSocket();
    socket.on("automatico", onAutomatico);
    return () => {
      alive = false;
      socket.off("automatico", onAutomatico);
    };
  }, [zonaId, tenantId]);

  const setModo = useCallback(
    async (actuador: string, modo: string) => {
      const data = (await setModoAutomatico(actuador, modo, zonaId)) as {
        config?: AutoConfig;
      } & AutoConfig;
      setConfig({ ...DEFAULT, ...(data.config ?? data) });
    },
    [zonaId]
  );

  const guardarConfig = useCallback(
    async (actuador: string, datos: Record<string, unknown>) => {
      const data = (await guardarAutomatico(actuador, datos, zonaId)) as {
        config?: AutoConfig;
      } & AutoConfig;
      setConfig({ ...DEFAULT, ...(data.config ?? data) });
    },
    [zonaId]
  );

  return { config, setModo, guardarConfig, loading, error, zonaId };
}
