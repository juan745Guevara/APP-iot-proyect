import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { tiempoRelativo } from "../utils/format";

export default function StatusBar({ ultimaLectura }: { ultimaLectura: string | null }) {
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>Última lectura: {tiempoRelativo(ultimaLectura)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  text: { color: colors.textMuted, fontSize: 12 },
});
