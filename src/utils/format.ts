export function formatFecha(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function tiempoRelativo(iso?: string | null): string {
  if (!iso) return "sin datos";
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "sin datos";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `hace ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  return `hace ${h}h`;
}

export function formatValor(
  sensor: string,
  valor: number | null | undefined
): string {
  if (valor === null || valor === undefined) return "—";
  const n = Number(valor);
  if (Number.isNaN(n)) return "—";
  if (sensor === "temperatura") return `${n.toFixed(1)} °C`;
  return `${n.toFixed(0)} %`;
}
