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
import { useLog } from "../hooks/useLog";
import { useEstadisticas } from "../hooks/useEstadisticas";
import { RANGOS_HISTORIAL, SENSORES } from "../constants/invernadero";
import { formatFecha } from "../utils/format";
import { colors } from "../theme";

type Tab = "datos" | "stats" | "log";

export default function HistorialScreen() {
  const [tab, setTab] = useState<Tab>("datos");
  const [sensor, setSensor] = useState<string>(SENSORES[0].id);
  const [rango, setRango] = useState<string>("24h");
  const { puntos, loading, error } = useHistorial(sensor, rango);
  const { items: logItems, loading: logLoading } = useLog();
  const { semana, prediccion, loading: stLoading } = useEstadisticas();

  return (
    <View style={styles.root}>
      <View style={styles.tabs}>
        {(
          [
            ["datos", "Datos"],
            ["stats", "Stats"],
            ["log", "Acciones"],
          ] as const
        ).map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "datos" && (
        <>
          <View style={styles.row}>
            {SENSORES.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => setSensor(s.id)}
                style={[styles.chip, sensor === s.id && styles.chipActive]}
              >
                <Text style={styles.chipText}>{s.short}</Text>
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
                <Text
                  style={[
                    styles.chipLabel,
                    rango === r.id && styles.chipLabelActive,
                  ]}
                >
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
              ListEmptyComponent={
                <Text style={styles.empty}>Sin datos</Text>
              }
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
                  <Text style={styles.valor}>
                    {Number(item.valor).toFixed(1)}
                  </Text>
                  <Text style={styles.ts}>{formatFecha(item.timestamp)}</Text>
                </View>
              )}
            />
          )}
        </>
      )}

      {tab === "stats" &&
        (stLoading ? (
          <LoadingView message="Cargando estadísticas…" />
        ) : (
          <View style={styles.panel}>
            <Text style={styles.section}>Predicción temperatura</Text>
            <Text style={styles.meta}>
              {JSON.stringify(prediccion ?? {}, null, 0).slice(0, 280)}
            </Text>
            <Text style={[styles.section, { marginTop: 16 }]}>
              Estadísticas semana
            </Text>
            <Text style={styles.meta}>
              {JSON.stringify(semana ?? {}, null, 0).slice(0, 400)}
            </Text>
          </View>
        ))}

      {tab === "log" &&
        (logLoading ? (
          <LoadingView message="Cargando acciones…" />
        ) : (
          <FlatList
            data={logItems}
            keyExtractor={(item, i) => String(item.id ?? i)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>Sin acciones</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.valor}>
                  {item.actuador} → {item.estado}
                </Text>
                <Text style={styles.ts}>
                  {item.origen || ""} ·{" "}
                  {formatFecha(item.creado_en || item.timestamp)}
                </Text>
              </View>
            )}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 8 },
  tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  tabActive: { borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12 },
  tabTextActive: { color: colors.text, fontWeight: "700" },
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
    gap: 8,
  },
  valor: { color: colors.text, fontWeight: "600", flex: 1 },
  ts: { color: colors.textMuted, fontSize: 12 },
  summary: { color: colors.textMuted, marginBottom: 12 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  error: { color: colors.danger, paddingHorizontal: 16 },
  panel: { padding: 16 },
  section: { color: colors.text, fontWeight: "700", fontSize: 16 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
});
