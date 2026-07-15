import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useZonas } from "../hooks/useZonas";
import { useZonaActiva } from "../context/ZonaContext";
import { colors } from "../theme";

export default function ZonaSelector() {
  const { zonas } = useZonas();
  const { zonaId, setZonaId } = useZonaActiva();

  if (!zonas.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {zonas.map((z) => {
        const active = z.id === zonaId;
        const online = z.estado?.conectado;
        return (
          <Pressable
            key={z.id}
            onPress={() => setZonaId(z.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.dot, online ? styles.online : styles.offline]}>●</Text>
            <Text style={[styles.text, active && styles.textActive]}>
              {z.nombre || z.id}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  text: { color: colors.textMuted, fontSize: 13 },
  textActive: { color: colors.text, fontWeight: "600" },
  dot: { fontSize: 10 },
  online: { color: colors.primary },
  offline: { color: colors.danger },
});
