import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";
import { useZonaActiva } from "../context/ZonaContext";
import { colors, fonts, radius } from "../theme";

export default function AnomalyBanner() {
  const { zonaId, tenantId } = useZonaActiva();
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onAnomalia = (payload: Record<string, unknown>) => {
      if (
        !matchesTenantZona(
          payload as { tenant_id?: string; zona_id?: string },
          tenantId,
          zonaId
        )
      ) {
        return;
      }
      setMensaje((payload.mensaje as string) || "Anomaly detected");
      clearTimeout(timer);
      timer = setTimeout(() => setMensaje(null), 10000);
    };
    const socket = getSocket();
    socket.on("anomalia", onAnomalia);
    return () => {
      socket.off("anomalia", onAnomalia);
      clearTimeout(timer);
    };
  }, [zonaId, tenantId]);

  if (!mensaje) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.kicker}>Anomaly</Text>
      <Text style={styles.text}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.35)",
    padding: 14,
    gap: 4,
  },
  kicker: {
    fontFamily: fonts.body,
    color: colors.warning,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  text: {
    fontFamily: fonts.body,
    color: "#fde68a",
    fontSize: 13,
    lineHeight: 18,
  },
});
