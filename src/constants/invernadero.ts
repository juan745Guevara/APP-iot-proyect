export const SENSORES = [
  { id: "temperatura", label: "Temperatura", unidad: "°C", short: "TEMP" },
  { id: "humedad_aire", label: "Humedad aire", unidad: "%", short: "AIR" },
  { id: "humedad_suelo", label: "Humedad suelo", unidad: "%", short: "SOIL" },
  { id: "luminosidad", label: "Luminosidad", unidad: "%", short: "LIGHT" },
] as const;

export const ACTUADORES = [
  { id: "ventilador", label: "Ventilación", short: "FAN" },
  { id: "bomba", label: "Riego", short: "PUMP" },
] as const;

export const ESTADO = { ON: "ON", OFF: "OFF" } as const;
export type EstadoActuador = (typeof ESTADO)[keyof typeof ESTADO];

export const ESTADO_INICIAL_ACTUADORES: Record<string, EstadoActuador> = {
  ventilador: ESTADO.OFF,
  bomba: ESTADO.OFF,
};

export const RANGOS_HISTORIAL = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
] as const;
