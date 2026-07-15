import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export default function LoadingView({ message = "Cargando…" }: { message?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    gap: 12,
  },
  text: { color: colors.textMuted, fontSize: 14 },
});
