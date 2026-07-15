import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LoadingView from "../components/LoadingView";
import { useHistorial } from "../hooks/useHistorial";
import { RANGOS_HISTORIAL, SENSORES } from "../constants/invernadero";
import { formatFecha } from "../utils/format";
import { colors } from "../theme";

export default function HistorialScreen() {
  const [sensor, setSensor] = useState<string>(SENSORES[0].id);
  const [rango, setRango] = useState<string>("24h");
  const { puntos, loading, error } = useHistorial(sensor, rango);

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        {SENSORES.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSensor(s.id)}
            style={[styles.chip, sensor === s.id && styles.chipActive]}
          >
            <Text style={styles.chipText}>{s.icono}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {RANGOS_HISTORIAL.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => setRango(r.id)}
            style={[styles.chip, rango === r.id && styles.chipActive]}
          >
            <Text style={[styles.chipLabel, rango === r.id && styles.chipLabelActive]}>
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <LoadingView message="Cargando historial…" />
      ) : (
        <FlatList
          data={[...puntos].reverse().slice(0, 100)}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Sin datos</Text>}
          ListHeaderComponent={
            puntos.length > 0 ? (
              <Text style={styles.summary}>
                {puntos.length} puntos · último:{" "}
                {Number(puntos[puntos.length - 1]?.valor ?? 0).toFixed(1)}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.valor}>{Number(item.valor).toFixed(1)}</Text>
              <Text style={styles.ts}>{formatFecha(item.timestamp)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 8 },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: { borderColor: colors.primary },
  chipText: { fontSize: 16 },
  chipLabel: { color: colors.textMuted, fontSize: 13 },
  chipLabelActive: { color: colors.text, fontWeight: "600" },
  list: { padding: 16 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  valor: { color: colors.text, fontWeight: "600" },
  ts: { color: colors.textMuted, fontSize: 12 },
  summary: { color: colors.textMuted, marginBottom: 12 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  error: { color: colors.danger, paddingHorizontal: 16 },
});
