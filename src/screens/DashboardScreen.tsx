import { ScrollView, StyleSheet, Text, View } from "react-native";
import SensorCard from "../components/SensorCard";
import ActuadorCard from "../components/ActuadorCard";
import ZonaSelector from "../components/ZonaSelector";
import StatusBar from "../components/StatusBar";
import LoadingView from "../components/LoadingView";
import { useSensores } from "../hooks/useSensores";
import { useActuadores } from "../hooks/useActuadores";
import { useAuth } from "../context/AuthContext";
import { ACTUADORES, SENSORES } from "../constants/invernadero";
import { colors } from "../theme";

export default function DashboardScreen() {
  const { sensores, ultimaLectura, loading, error } = useSensores();
  const { actuadores, busy, toggle, error: actError } = useActuadores();
  const { user } = useAuth();
  const canWrite = user?.rol === "admin" || user?.rol === "superadmin";

  if (loading && sensores.temperatura === null) {
    return <LoadingView message="Cargando sensores…" />;
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <ZonaSelector />
      <StatusBar ultimaLectura={ultimaLectura} />
      {(error || actError) && (
        <Text style={styles.error}>{error || actError}</Text>
      )}

      <Text style={styles.section}>Sensores</Text>
      <View style={styles.grid}>
        {SENSORES.map((s) => (
          <SensorCard
            key={s.id}
            label={s.label}
            unidad={s.unidad}
            icono={s.icono}
            sensorKey={s.id}
            valor={sensores[s.id]}
          />
        ))}
      </View>

      <Text style={styles.section}>Actuadores</Text>
      <View style={styles.row}>
        {ACTUADORES.map((a) => (
          <ActuadorCard
            key={a.id}
            label={a.label}
            icono={a.icono}
            estado={actuadores[a.id] || "OFF"}
            busy={busy === a.id}
            disabled={!canWrite}
            onToggle={() => toggle(a.id)}
          />
        ))}
      </View>
      {!canWrite && (
        <Text style={styles.hint}>Tu rol es de solo lectura</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 8, paddingBottom: 32 },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  row: { flexDirection: "row", gap: 10 },
  error: { color: colors.danger, marginBottom: 8 },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
});
