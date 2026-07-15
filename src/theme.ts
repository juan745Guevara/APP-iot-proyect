import { Platform, TextStyle } from "react-native";

/** Climate-tech dark UI — preciso, poco ruido */
export const colors = {
  bg: "#09090b",
  bgMid: "#0c0c0f",
  surface: "#111114",
  surfaceAlt: "#18181b",
  surfaceRaised: "#1f1f24",
  border: "#27272a",
  borderSoft: "#1c1c1f",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  textDim: "#71717a",
  primary: "#22c55e",
  primaryDark: "#16a34a",
  primarySoft: "rgba(34, 197, 94, 0.12)",
  danger: "#ef4444",
  dangerSoft: "rgba(239, 68, 68, 0.12)",
  warning: "#eab308",
  warningSoft: "rgba(234, 179, 8, 0.12)",
  info: "#38bdf8",
  leaf: "#4ade80",
  soil: "#a8a29e",
  mist: "transparent",
  white: "#ffffff",
};

export const fonts = {
  brand: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif-medium",
    default: "System",
  }) as string,
  body: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif",
    default: "System",
  }) as string,
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }) as string,
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const sensorAccent: Record<string, string> = {
  temperatura: "#fb923c",
  humedad_aire: "#38bdf8",
  humedad_suelo: "#84cc16",
  luminosidad: "#eab308",
};

export const typography = {
  section: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textDim,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  } as TextStyle,
};
