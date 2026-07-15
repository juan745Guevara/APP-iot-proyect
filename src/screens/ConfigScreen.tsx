import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LoadingView from "../components/LoadingView";
import { useUmbrales } from "../hooks/useUmbrales";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

const CAMPOS = [
  { key: "temperatura_min", label: "Temp. mín (°C)" },
  { key: "temperatura_max", label: "Temp. máx (°C)" },
  { key: "humedad_aire_min", label: "Hum. aire mín (%)" },
  { key: "humedad_aire_max", label: "Hum. aire máx (%)" },
  { key: "humedad_suelo_min", label: "Hum. suelo mín (%)" },
  { key: "humedad_suelo_max", label: "Hum. suelo máx (%)" },
  { key: "luminosidad_min", label: "Luz mín (%)" },
  { key: "luminosidad_max", label: "Luz máx (%)" },
];

export default function ConfigScreen() {
  const { user } = useAuth();
  const { umbrales, loading, saving, error, guardar } = useUmbrales();
  const [form, setForm] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const canEdit = user?.rol === "admin" || user?.rol === "superadmin";

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const c of CAMPOS) {
      next[c.key] = umbrales[c.key] != null ? String(umbrales[c.key]) : "";
    }
    setForm(next);
  }, [umbrales]);

  if (loading && !Object.keys(umbrales).length) {
    return <LoadingView message="Cargando umbrales…" />;
  }

  const onSave = async () => {
    setMsg(null);
    const datos: Record<string, number> = {};
    for (const c of CAMPOS) {
      const n = Number(form[c.key]);
      if (!Number.isFinite(n)) {
        setMsg(`Valor inválido: ${c.label}`);
        return;
      }
      datos[c.key] = n;
    }
    try {
      await guardar(datos);
      setMsg("Umbrales guardados");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Umbrales de alerta</Text>
      {!canEdit && (
        <Text style={styles.hint}>Solo admin puede editar umbrales</Text>
      )}
      {CAMPOS.map((c) => (
        <View key={c.key} style={styles.field}>
          <Text style={styles.label}>{c.label}</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            editable={canEdit}
            value={form[c.key] ?? ""}
            onChangeText={(t) => setForm((f) => ({ ...f, [c.key]: t }))}
            placeholderTextColor={colors.textMuted}
          />
        </View>
      ))}
      {(error || msg) && (
        <Text style={[styles.msg, error && !msg ? styles.err : styles.ok]}>
          {msg || error}
        </Text>
      )}
      {canEdit && (
        <Pressable style={styles.btn} onPress={onSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Guardar</Text>
          )}
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  hint: { color: colors.warning, marginBottom: 12, fontSize: 13 },
  field: { marginBottom: 12 },
  label: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  btn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  msg: { marginVertical: 8, fontSize: 13 },
  ok: { color: colors.primary },
  err: { color: colors.danger },
});
