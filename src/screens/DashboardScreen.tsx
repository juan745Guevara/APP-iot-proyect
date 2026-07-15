import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import SensorCard from "../components/SensorCard";
import ActuadorCard from "../components/ActuadorCard";
import ZonaSelector from "../components/ZonaSelector";
import StatusBar from "../components/StatusBar";
import AlertBar from "../components/AlertBar";
import AnomalyBanner from "../components/AnomalyBanner";
import LoadingView from "../components/LoadingView";
import { useSensores } from "../hooks/useSensores";
import { useActuadores } from "../hooks/useActuadores";
import { useUmbrales } from "../hooks/useUmbrales";
import { useAutomatico } from "../hooks/useAutomatico";
import { useAuth } from "../context/AuthContext";
import { useAlertas } from "../hooks/useAlertas";
import { ACTUADORES, SENSORES } from "../constants/invernadero";
import { colors, fonts, radius, typography } from "../theme";

export default function DashboardScreen() {
  const { sensores, ultimaLectura, loading, error } = useSensores();
  const { actuadores, busy, toggle, error: actError } = useActuadores();
  const { umbrales } = useUmbrales();
  const { config } = useAutomatico();
  const { alertas } = useAlertas({ soloActivas: true });
  const { user } = useAuth();
  const canWrite = user?.rol === "admin" || user?.rol === "superadmin";

  if (loading && sensores.temperatura === null) {
    return <LoadingView message="Loading telemetry…" />;
  }

  const onlineCount = 1; // zona activa; simplified KPI
  const activeActuators = Object.values(actuadores).filter((v) => v === "ON")
    .length;

  return (
    <Screen>
      <View>
        <Text style={styles.kicker}>Operations</Text>
        <Text style={styles.headline}>Overview</Text>
      </View>

      <ZonaSelector />
      <StatusBar ultimaLectura={ultimaLectura} />

      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Text style={styles.kpiValue}>{alertas.length}</Text>
          <Text style={styles.kpiLabel}>Open alerts</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpi}>
          <Text style={styles.kpiValue}>{activeActuators}</Text>
          <Text style={styles.kpiLabel}>Actuators on</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpi}>
          <Text style={styles.kpiValue}>{onlineCount}</Text>
          <Text style={styles.kpiLabel}>Active zone</Text>
        </View>
      </View>

      <AnomalyBanner />
      <AlertBar sensores={sensores} umbrales={umbrales} />

      {(error || actError) && (
        <Text style={styles.error}>{error || actError}</Text>
      )}

      <View>
        <Text style={typography.section}>Sensors</Text>
        <View style={styles.grid}>
          {SENSORES.map((s) => (
            <SensorCard
              key={s.id}
              label={s.label}
              unidad={s.unidad}
              short={s.short}
              sensorKey={s.id}
              valor={sensores[s.id]}
            />
          ))}
        </View>
      </View>

      <View>
        <Text style={typography.section}>Controls</Text>
        <View style={styles.row}>
          {ACTUADORES.map((a) => {
            const modo =
              (config as Record<string, { modo?: string }>)[a.id]?.modo ||
              "manual";
            return (
              <ActuadorCard
                key={a.id}
                label={a.label}
                short={a.short}
                estado={actuadores[a.id] || "OFF"}
                modo={modo}
                busy={busy === a.id}
                disabled={!canWrite || modo === "automatico"}
                onToggle={() => toggle(a.id)}
              />
            );
          })}
        </View>
        {!canWrite && (
          <Text style={styles.hint}>Read-only role — controls locked</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textDim,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headline: {
    fontFamily: fonts.brand,
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.6,
  },
  kpiRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
  },
  kpi: { flex: 1, alignItems: "center", gap: 2 },
  kpiDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  kpiValue: {
    fontFamily: fonts.mono,
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  kpiLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textDim,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  error: {
    fontFamily: fonts.body,
    color: colors.danger,
    fontSize: 13,
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 12,
    marginTop: 10,
  },
});
