import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

export default function LoadingView({
  message = "Loading…",
}: {
  message?: string;
}) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary} />
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
  text: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 13,
  },
});
