import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LoadingView from "../components/LoadingView";
import { useZonas } from "../hooks/useZonas";
import { useAuth } from "../context/AuthContext";
import { crearZona, eliminarZona } from "../api/client";
import { formatFecha } from "../utils/format";
import { colors } from "../theme";

export default function EstadoScreen() {
  const { zonas, loading, error, recargar } = useZonas();
  const { user } = useAuth();
  const canEdit = user?.rol === "admin" || user?.rol === "superadmin";
  const [nuevoId, setNuevoId] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  if (loading && !zonas.length) {
    return <LoadingView message="Cargando zonas…" />;
  }

  return (
    <View style={styles.root}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {msg ? <Text style={styles.msg}>{msg}</Text> : null}

      {canEdit && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="zona_id (ej. zona2)"
            placeholderTextColor={colors.textMuted}
            value={nuevoId}
            onChangeText={setNuevoId}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={colors.textMuted}
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
          <Pressable
            style={styles.btn}
            onPress={async () => {
              setMsg(null);
              try {
                await crearZona({
                  id: nuevoId.trim(),
                  nombre: nuevoNombre.trim() || nuevoId.trim(),
                });
                setNuevoId("");
                setNuevoNombre("");
                await recargar();
              } catch (err) {
                setMsg(err instanceof Error ? err.message : "Error");
              }
            }}
          >
            <Text style={styles.btnText}>Crear zona</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={zonas}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={recargar}
            tintColor={colors.primary}
          />
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
              {canEdit && (
                <Pressable
                  style={[styles.btn, styles.danger]}
                  onPress={async () => {
                    try {
                      await eliminarZona(item.id);
                      await recargar();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Error");
                    }
                  }}
                >
                  <Text style={styles.btnText}>Desactivar</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  form: { padding: 16, gap: 8 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { color: colors.text, fontSize: 16, fontWeight: "700" },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  on: { color: "#052e16", backgroundColor: colors.primary },
  off: { color: "#fff", backgroundColor: colors.danger },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  error: { color: colors.danger, padding: 16 },
  msg: { color: colors.warning, paddingHorizontal: 16 },
  btn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  danger: { backgroundColor: colors.danger, marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "700" },
});
