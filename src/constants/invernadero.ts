export const SENSORES = [
  { id: "temperatura", label: "Temperatura", unidad: "°C", icono: "🌡️" },
  { id: "humedad_aire", label: "Humedad aire", unidad: "%", icono: "💧" },
  { id: "humedad_suelo", label: "Humedad suelo", unidad: "%", icono: "🌱" },
  { id: "luminosidad", label: "Luminosidad", unidad: "%", icono: "☀️" },
] as const;

export const ACTUADORES = [
  { id: "ventilador", label: "Ventilación", icono: "🌀" },
  { id: "bomba", label: "Riego", icono: "💦" },
] as const;

export const ESTADO = { ON: "ON", OFF: "OFF" } as const;
export type EstadoActuador = (typeof ESTADO)[keyof typeof ESTADO];

export const ESTADO_INICIAL_ACTUADORES: Record<string, EstadoActuador> = {
  ventilador: ESTADO.OFF,
  bomba: ESTADO.OFF,
};

export const RANGOS_HISTORIAL = [
  { id: "24h", label: "24 h" },
  { id: "7d", label: "7 d" },
  { id: "30d", label: "30 d" },
] as const;
