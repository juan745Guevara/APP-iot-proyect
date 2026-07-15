/**
 * Notificaciones locales de alerta (sin Expo / sin Firebase).
 * Eventos Socket.io → vibración + Alert nativo + banner in-app.
 */
import { Alert, Platform, PermissionsAndroid, Vibration } from "react-native";
import { getSocket } from "../socket";
import { matchesTenantZona } from "../utils/socketFilter";

export type ToastPayload = {
  title: string;
  body: string;
  kind?: "alerta" | "anomalia";
};

type Listener = (t: ToastPayload) => void;
const toastListeners = new Set<Listener>();

let filter = { tenantId: null as string | null | undefined, zonaId: null as string | null | undefined };
let attached = false;

export function subscribeToast(cb: Listener) {
  toastListeners.add(cb);
  return () => {
    toastListeners.delete(cb);
  };
}

function emitToast(t: ToastPayload) {
  toastListeners.forEach((cb) => cb(t));
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

function notify(title: string, body: string, kind: ToastPayload["kind"] = "alerta") {
  Vibration.vibrate([0, 250, 120, 250]);
  emitToast({ title, body, kind });
  Alert.alert(title, body);
}

function onAlerta(payload: Record<string, unknown>) {
  if (
    !matchesTenantZona(
      payload as { tenant_id?: string; zona_id?: string },
      filter.tenantId,
      filter.zonaId
    )
  ) {
    return;
  }
  const msg =
    (payload.mensaje as string) ||
    (payload.tipo as string) ||
    "Nueva alerta del invernadero";
  notify("Alerta invernadero", msg, "alerta");
}

function onAnomalia(payload: Record<string, unknown>) {
  if (
    !matchesTenantZona(
      payload as { tenant_id?: string; zona_id?: string },
      filter.tenantId,
      filter.zonaId
    )
  ) {
    return;
  }
  const msg = (payload.mensaje as string) || "Anomalía detectada en sensores";
  notify("Anomalía", msg, "anomalia");
}

export function startAlertNotifications(opts: {
  tenantId?: string | null;
  zonaId?: string | null;
}) {
  filter = { tenantId: opts.tenantId, zonaId: opts.zonaId };
  ensureNotificationPermission().catch(() => undefined);

  if (attached) return;
  attached = true;
  const socket = getSocket();
  socket.on("alerta", onAlerta);
  socket.on("anomalia", onAnomalia);
}

export function stopAlertNotifications() {
  if (!attached) return;
  const socket = getSocket();
  socket.off("alerta", onAlerta);
  socket.off("anomalia", onAnomalia);
  attached = false;
}
