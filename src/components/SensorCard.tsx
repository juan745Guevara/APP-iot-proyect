import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, sensorAccent } from "../theme";
import { formatValor } from "../utils/format";

type Props = {
  label: string;
  valor: number | null;
  unidad: string;
  short: string;
  sensorKey: string;
};

export default function SensorCard({
  label,
  valor,
  short,
  sensorKey,
}: Props) {
  const accent = sensorAccent[sensorKey] || colors.primary;
  const empty = valor === null || valor === undefined;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={[styles.short, { color: accent }]}>{short}</Text>
        <View style={[styles.pip, { backgroundColor: accent }]} />
      </View>
      <Text style={[styles.value, empty && styles.valueEmpty]}>
        {formatValor(sensorKey, valor)}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  short: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  pip: { width: 6, height: 6, borderRadius: 3 },
  value: {
    fontFamily: fonts.mono,
    color: colors.text,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.8,
    marginTop: 4,
  },
  valueEmpty: { color: colors.textDim },
  label: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 12,
  },
});
