import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import LoadingView from "../components/LoadingView";
import { useZonas } from "../hooks/useZonas";
import { formatFecha } from "../utils/format";
import { colors } from "../theme";

export default function EstadoScreen() {
  const { zonas, loading, error, recargar } = useZonas();

  if (loading && !zonas.length) {
    return <LoadingView message="Cargando zonas…" />;
  }

  return (
    <View style={styles.root}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={zonas}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={recargar} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const online = !!item.estado?.conectado;
          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.nombre || item.id}</Text>
                <Text style={[styles.badge, online ? styles.on : styles.off]}>
                  {online ? "ONLINE" : "OFFLINE"}
                </Text>
              </View>
              <Text style={styles.meta}>ID: {item.id}</Text>
              <Text style={styles.meta}>
                Última vez: {formatFecha(item.estado?.ultima_vez)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: colors.text, fontSize: 16, fontWeight: "700" },
  badge: { fontSize: 11, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: "hidden" },
  on: { color: "#052e16", backgroundColor: colors.primary },
  off: { color: "#fff", backgroundColor: colors.danger },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  error: { color: colors.danger, padding: 16 },
});
