import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type Props = {
  label: string;
  icono: string;
  estado: string;
  busy?: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export default function ActuadorCard({
  label,
  icono,
  estado,
  busy,
  onToggle,
  disabled,
}: Props) {
  const on = estado === "ON";
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icono}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.estado, on && styles.estadoOn]}>{on ? "ENCENDIDO" : "APAGADO"}</Text>
      <Pressable
        style={[styles.btn, on ? styles.btnOff : styles.btnOn, (busy || disabled) && styles.btnDisabled]}
        onPress={onToggle}
        disabled={!!busy || disabled}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>{on ? "Apagar" : "Encender"}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
  },
  icon: { fontSize: 22 },
  label: { color: colors.text, fontSize: 16, fontWeight: "600" },
  estado: { color: colors.textMuted, fontSize: 12, marginBottom: 8 },
  estadoOn: { color: colors.primary },
  btn: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnOn: { backgroundColor: colors.primaryDark },
  btnOff: { backgroundColor: colors.danger },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "700" },
});
