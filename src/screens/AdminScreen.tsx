import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  crearAdminUsuario,
  desactivarAdminUsuario,
  getAdminUsuarios,
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import LoadingView from "../components/LoadingView";
import { colors } from "../theme";

type AdminUser = {
  id: number;
  usuario: string;
  rol: string;
  activo?: boolean;
};

export default function AdminScreen() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const isAdmin = user?.rol === "admin" || user?.rol === "superadmin";

  const cargar = async () => {
    setLoading(true);
    try {
      const data = (await getAdminUsuarios()) as
        | { usuarios?: AdminUser[] }
        | AdminUser[];
      setUsuarios(Array.isArray(data) ? data : data.usuarios ?? []);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) cargar();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <View style={styles.root}>
        <Text style={styles.meta}>Solo administradores</Text>
      </View>
    );
  }

  if (loading) return <LoadingView message="Cargando usuarios…" />;

  return (
    <View style={styles.root}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nuevo usuario"
          placeholderTextColor={colors.textMuted}
          value={nuevo}
          onChangeText={setNuevo}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.textMuted}
          value={pass}
          onChangeText={setPass}
          secureTextEntry
        />
        <Pressable
          style={styles.btn}
          onPress={async () => {
            setMsg(null);
            try {
              await crearAdminUsuario({
                usuario: nuevo.trim(),
                password: pass,
                rol: "lectura",
              });
              setNuevo("");
              setPass("");
              await cargar();
            } catch (err) {
              setMsg(err instanceof Error ? err.message : "Error");
            }
          }}
        >
          <Text style={styles.btnText}>Crear</Text>
        </Pressable>
      </View>
      {msg ? <Text style={styles.err}>{msg}</Text> : null}
      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.usuario} · {item.rol}
            </Text>
            <Pressable
              style={[styles.btn, styles.danger]}
              onPress={async () => {
                await desactivarAdminUsuario(item.id);
                await cargar();
              }}
            >
              <Text style={styles.btnText}>Desactivar</Text>
            </Pressable>
          </View>
        )}
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
  btn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  danger: { backgroundColor: colors.danger, marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  name: { color: colors.text, fontWeight: "600" },
  meta: { color: colors.textMuted, padding: 16 },
  err: { color: colors.danger, paddingHorizontal: 16 },
});
