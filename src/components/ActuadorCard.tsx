import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, fonts, radius } from "../theme";

type Props = {
  label: string;
  short: string;
  estado: string;
  modo?: string;
  busy?: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export default function ActuadorCard({
  label,
  short,
  estado,
  modo = "manual",
  busy,
  onToggle,
  disabled,
}: Props) {
  const on = estado === "ON";
  const auto = modo === "automatico";

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.short}>{short}</Text>
        <Text style={[styles.badge, on ? styles.badgeOn : styles.badgeOff]}>
          {on ? "Active" : "Idle"}
        </Text>
      </View>

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.meta}>{auto ? "Auto mode" : "Manual control"}</Text>

      <Pressable
        style={[
          styles.btn,
          on ? styles.btnStop : styles.btnStart,
          (busy || disabled) && styles.btnDisabled,
        ]}
        onPress={onToggle}
        disabled={!!busy || disabled}
      >
        {busy ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          <Text style={styles.btnText}>{on ? "Stop" : "Start"}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  short: {
    fontFamily: fonts.mono,
    color: colors.textDim,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  badge: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  badgeOn: {
    color: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  badgeOff: {
    color: colors.textDim,
    backgroundColor: colors.surfaceRaised,
  },
  label: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  btn: {
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  btnStart: {
    backgroundColor: colors.primarySoft,
    borderColor: "rgba(34, 197, 94, 0.35)",
  },
  btnStop: {
    backgroundColor: colors.dangerSoft,
    borderColor: "rgba(239, 68, 68, 0.35)",
  },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    fontFamily: fonts.body,
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },
});
