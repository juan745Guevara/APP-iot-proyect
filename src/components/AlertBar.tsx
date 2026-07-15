import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../theme";
import type { Sensores } from "../hooks/useSensores";

const UMBRALES_DEFAULT: Record<string, number> = {
  temperatura_min: 10,
  temperatura_max: 35,
  humedad_aire_min: 40,
  humedad_aire_max: 90,
  humedad_suelo_min: 30,
  humedad_suelo_max: 80,
  luminosidad_min: 20,
  luminosidad_max: 95,
};

export default function AlertBar({
  sensores,
  umbrales = {},
}: {
  sensores: Sensores;
  umbrales?: Record<string, number>;
}) {
  const u = { ...UMBRALES_DEFAULT, ...umbrales };
  const alertas: string[] = [];

  if (sensores.temperatura != null) {
    const t = Number(sensores.temperatura);
    if (t > u.temperatura_max) {
      alertas.push(`Temp high (${t.toFixed(1)}°C)`);
    } else if (t < u.temperatura_min) {
      alertas.push(`Temp low (${t.toFixed(1)}°C)`);
    }
  }
  if (sensores.humedad_aire != null) {
    const h = Math.round(sensores.humedad_aire);
    if (h > u.humedad_aire_max) alertas.push(`Air humidity high (${h}%)`);
    else if (h < u.humedad_aire_min) alertas.push(`Air humidity low (${h}%)`);
  }
  if (sensores.humedad_suelo != null) {
    const h = Math.round(sensores.humedad_suelo);
    if (h > u.humedad_suelo_max) alertas.push(`Soil moisture high (${h}%)`);
    else if (h < u.humedad_suelo_min) alertas.push(`Soil moisture low (${h}%)`);
  }
  if (sensores.luminosidad != null) {
    const l = Math.round(sensores.luminosidad);
    if (l > u.luminosidad_max) alertas.push(`Light high (${l}%)`);
    else if (l < u.luminosidad_min) alertas.push(`Light low (${l}%)`);
  }

  if (!alertas.length) return null;

  return (
    <View style={styles.bar}>
      <Text style={styles.title}>Threshold breach</Text>
      {alertas.map((a) => (
        <Text key={a} style={styles.msg}>
          {a}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
    padding: 14,
    gap: 4,
  },
  title: {
    fontFamily: fonts.body,
    color: colors.danger,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  msg: {
    fontFamily: fonts.body,
    color: "#fecaca",
    fontSize: 13,
  },
});
