import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../theme";
import { tiempoRelativo } from "../utils/format";

export default function StatusBar({
  ultimaLectura,
}: {
  ultimaLectura: string | null;
}) {
  const fresh =
    !!ultimaLectura &&
    Date.now() - new Date(ultimaLectura).getTime() < 30_000;

  return (
    <View style={styles.bar}>
      <View style={[styles.dot, fresh ? styles.live : styles.stale]} />
      <Text style={styles.text}>
        Last sync{" "}
        <Text style={styles.em}>{tiempoRelativo(ultimaLectura)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  live: { backgroundColor: colors.primary },
  stale: { backgroundColor: colors.warning },
  text: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 13,
  },
  em: { color: colors.textMuted, fontWeight: "600" },
});
