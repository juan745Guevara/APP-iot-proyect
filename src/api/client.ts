import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_URL,
  TOKEN_KEY,
  USER_KEY,
  TENANT_KEY,
  ZONA_DEFAULT,
} from "../config";

export type User = {
  id?: number;
  usuario: string;
  rol: string;
  tenant_id?: string | null;
};

export type LoginResponse = {
  token: string;
  usuario: string;
  rol: string;
  tenant_id?: string | null;
};

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function getStoredTenantId(): Promise<string | null> {
  const user = await getStoredUser();
  if (user?.tenant_id) return user.tenant_id;
  return AsyncStorage.getItem(TENANT_KEY);
}

async function authHeaders(extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { ...extra };
  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && (await getToken())) {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      onUnauthorized?.();
    }
    throw new Error((data as { error?: string }).error || `Error HTTP ${res.status}`);
  }
  return data;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = await authHeaders(
    (options.headers as Record<string, string>) || {}
  );
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  return parseResponse(res);
}

async function tenantParams(extra: Record<string, string | number | boolean | undefined> = {}) {
  const tid = await getStoredTenantId();
  if (tid) return { tenant_id: tid, ...extra };
  return extra;
}

async function qs(params: Record<string, string | number | boolean | undefined> = {}) {
  const p = new URLSearchParams();
  const merged = await tenantParams(params);
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && v !== null) p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function login(usuario: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  return parseResponse(res) as Promise<LoginResponse>;
}

export async function getMe() {
  return apiFetch("/api/auth/me");
}

export async function logoutApi() {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    /* token ya inválido */
  }
}

export async function getZonas() {
  return apiFetch("/api/zonas");
}

export async function getSensores(zona_id = ZONA_DEFAULT) {
  return apiFetch(`/api/sensores${await qs({ zona_id })}`);
}

export async function getActuadores(zona_id = ZONA_DEFAULT) {
  return apiFetch(`/api/actuadores${await qs({ zona_id })}`);
}

export async function toggleActuador(
  actuador: string,
  estado: string,
  zona_id = ZONA_DEFAULT
) {
  const data = (await apiFetch("/api/actuador", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actuador, estado, zona_id }),
  })) as { ok?: boolean; error?: string };
  if (!data.ok) throw new Error(data.error || "Error al cambiar el actuador");
  return data;
}

export async function getHistorial(params: {
  zona_id?: string;
  sensor: string;
  rango: string;
}) {
  return apiFetch(`/api/historial${await qs(params)}`);
}

export async function getUmbrales(zona_id = ZONA_DEFAULT) {
  return apiFetch(`/api/umbrales${await qs({ zona_id })}`);
}

export async function actualizarUmbrales(
  datos: Record<string, number>,
  zona_id = ZONA_DEFAULT
) {
  return apiFetch("/api/umbrales", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...datos, zona_id }),
  });
}

export async function getAlertas(opts: {
  zona_id?: string;
  limite?: number;
  pagina?: number;
  activas?: boolean;
} = {}) {
  const params: Record<string, string | number | boolean | undefined> = {
    zona_id: opts.zona_id ?? ZONA_DEFAULT,
    limite: opts.limite ?? 50,
    pagina: opts.pagina ?? 1,
  };
  if (opts.activas) params.activas = "true";
  return apiFetch(`/api/alertas${await qs(params)}`);
}

export async function resolverAlerta(id: number) {
  return apiFetch(`/api/alertas/${id}/resolver`, { method: "PATCH" });
}

export { API_URL, ZONA_DEFAULT };
