import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { formatValor } from "../utils/format";

type Props = {
  label: string;
  valor: number | null;
  unidad: string;
  icono: string;
  sensorKey: string;
};

export default function SensorCard({ label, valor, icono, sensorKey }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icono}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{formatValor(sensorKey, valor)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  icon: { fontSize: 22, marginBottom: 6 },
  label: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  value: { color: colors.text, fontSize: 22, fontWeight: "700" },
});
