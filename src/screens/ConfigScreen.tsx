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
import { useAutomatico } from "../hooks/useAutomatico";
import { useRiegos } from "../hooks/useRiegos";
import { useAuth } from "../context/AuthContext";
import { ACTUADORES } from "../constants/invernadero";
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

type Tab = "umbrales" | "automatico" | "riegos";

export default function ConfigScreen() {
  const { user } = useAuth();
  const { umbrales, loading, saving, error, guardar } = useUmbrales();
  const { config, setModo, loading: autoLoading } = useAutomatico();
  const { riegos, loading: rLoading, crear, eliminar, error: rError } =
    useRiegos();
  const [tab, setTab] = useState<Tab>("umbrales");
  const [form, setForm] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [hora, setHora] = useState("07:00");
  const [duracion, setDuracion] = useState("10");
  const canEdit = user?.rol === "admin" || user?.rol === "superadmin";

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const c of CAMPOS) {
      next[c.key] = umbrales[c.key] != null ? String(umbrales[c.key]) : "";
    }
    setForm(next);
  }, [umbrales]);

  if ((loading || autoLoading || rLoading) && !Object.keys(umbrales).length) {
    return <LoadingView message="Cargando configuración…" />;
  }

  const onSaveUmbrales = async () => {
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

  const onCrearRiego = async () => {
    setMsg(null);
    try {
      await crear({
        hora,
        duracion_min: Number(duracion) || 10,
        activo: true,
        dias: ["lun", "mar", "mie", "jue", "vie", "sab", "dom"],
      });
      setMsg("Riego programado");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.tabs}>
        {(
          [
            ["umbrales", "Umbrales"],
            ["automatico", "Automático"],
            ["riegos", "Riegos"],
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

      {!canEdit && (
        <Text style={styles.hint}>Solo admin puede modificar</Text>
      )}

      {tab === "umbrales" && (
        <>
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
          {canEdit && (
            <Pressable style={styles.btn} onPress={onSaveUmbrales} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Guardar umbrales</Text>
              )}
            </Pressable>
          )}
        </>
      )}

      {tab === "automatico" &&
        ACTUADORES.map((a) => {
          const cfg = (config as Record<string, { modo?: string }>)[a.id];
          const modo = cfg?.modo || "manual";
          return (
            <View key={a.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {a.short} · {a.label}
              </Text>
              <Text style={styles.meta}>Modo actual: {modo}</Text>
              <View style={styles.row}>
                {(["manual", "automatico"] as const).map((m) => (
                  <Pressable
                    key={m}
                    disabled={!canEdit}
                    onPress={() => setModo(a.id, m)}
                    style={[
                      styles.chip,
                      modo === m && styles.chipActive,
                      !canEdit && styles.disabled,
                    ]}
                  >
                    <Text style={styles.chipText}>
                      {m === "automatico" ? "Automático" : "Manual"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}

      {tab === "riegos" && (
        <>
          {canEdit && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Nuevo riego</Text>
              <Text style={styles.label}>Hora (HH:MM)</Text>
              <TextInput
                style={styles.input}
                value={hora}
                onChangeText={setHora}
                placeholder="07:00"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.label}>Duración (min)</Text>
              <TextInput
                style={styles.input}
                value={duracion}
                onChangeText={setDuracion}
                keyboardType="number-pad"
                placeholderTextColor={colors.textMuted}
              />
              <Pressable style={styles.btn} onPress={onCrearRiego}>
                <Text style={styles.btnText}>Programar</Text>
              </Pressable>
            </View>
          )}
          {riegos.map((r) => (
            <View key={r.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {r.hora} · {r.duracion_min ?? "?"} min
              </Text>
              <Text style={styles.meta}>
                {r.activo === false ? "Inactivo" : "Activo"}
              </Text>
              {canEdit && (
                <Pressable
                  style={[styles.btn, styles.btnDanger]}
                  onPress={() => eliminar(r.id)}
                >
                  <Text style={styles.btnText}>Eliminar</Text>
                </Pressable>
              )}
            </View>
          ))}
          {!riegos.length && (
            <Text style={styles.meta}>No hay riegos programados</Text>
          )}
        </>
      )}

      {(error || rError || msg) && (
        <Text style={[styles.msg, msg ? styles.ok : styles.err]}>
          {msg || error || rError}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 14 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  tabActive: { borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12 },
  tabTextActive: { color: colors.text, fontWeight: "700" },
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
    marginBottom: 8,
  },
  btn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  btnDanger: { backgroundColor: colors.danger },
  btnText: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { color: colors.text, fontWeight: "700", fontSize: 16 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  row: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  chipText: { color: colors.text, fontSize: 13 },
  disabled: { opacity: 0.5 },
  msg: { marginVertical: 8, fontSize: 13 },
  ok: { color: colors.primary },
  err: { color: colors.danger },
});
