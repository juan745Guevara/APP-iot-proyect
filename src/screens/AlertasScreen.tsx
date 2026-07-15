import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import LoadingView from "../components/LoadingView";
import { useAlertas } from "../hooks/useAlertas";
import { formatFecha } from "../utils/format";
import { colors } from "../theme";

export default function AlertasScreen() {
  const [soloActivas, setSoloActivas] = useState(true);
  const { alertas, loading, error, resolver } = useAlertas({ soloActivas });

  if (loading && !alertas.length) {
    return <LoadingView message="Cargando alertas…" />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarLabel}>Solo activas</Text>
        <Switch
          value={soloActivas}
          onValueChange={setSoloActivas}
          trackColor={{ true: colors.primaryDark, false: colors.border }}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={alertas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay alertas</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.msg}>{item.mensaje || item.tipo || "Alerta"}</Text>
            <Text style={styles.meta}>
              {item.sensor ? `${item.sensor} · ` : ""}
              {formatFecha(item.creada_en)}
            </Text>
            {!item.resuelta && (
              <Pressable style={styles.btn} onPress={() => resolver(item.id)}>
                <Text style={styles.btnText}>Resolver</Text>
              </Pressable>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toolbarLabel: { color: colors.text, fontSize: 14 },
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  msg: { color: colors.text, fontSize: 15, fontWeight: "600" },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  btn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  error: { color: colors.danger, paddingHorizontal: 16 },
});
