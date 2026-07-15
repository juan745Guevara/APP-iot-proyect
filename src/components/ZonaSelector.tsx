import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useZonas } from "../hooks/useZonas";
import { useZonaActiva } from "../context/ZonaContext";
import { colors, fonts, radius } from "../theme";

export default function ZonaSelector() {
  const { zonas } = useZonas();
  const { zonaId, setZonaId } = useZonaActiva();

  if (!zonas.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {zonas.map((z) => {
        const active = z.id === zonaId;
        const online = z.estado?.conectado;
        return (
          <Pressable
            key={z.id}
            onPress={() => setZonaId(z.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <View
              style={[styles.dot, online ? styles.online : styles.offline]}
            />
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
  row: { gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  text: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  textActive: { color: colors.text, fontWeight: "700" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  online: { backgroundColor: colors.primary },
  offline: { backgroundColor: colors.danger },
});
