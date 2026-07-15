import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, radius, space } from "../theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<"user" | "pass" | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(usuario.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logoMark}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.wordmark}>Leafgrid</Text>
          <Text style={styles.tagline}>
            Greenhouse operations for modern farms
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email or username</Text>
          <TextInput
            style={[styles.input, focused === "user" && styles.inputFocus]}
            placeholder="admin"
            placeholderTextColor={colors.textDim}
            autoCapitalize="none"
            autoCorrect={false}
            value={usuario}
            onChangeText={setUsuario}
            onFocus={() => setFocused("user")}
            onBlur={() => setFocused(null)}
          />

          <Text style={[styles.label, { marginTop: space.lg }]}>Password</Text>
          <TextInput
            style={[styles.input, focused === "pass" && styles.inputFocus]}
            placeholder="••••••••"
            placeholderTextColor={colors.textDim}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocused("pass")}
            onBlur={() => setFocused(null)}
            onSubmitEditing={onSubmit}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.btnText}>Continue</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.footer}>Connected to invernadero.online</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    paddingBottom: 40,
  },
  brandBlock: {
    marginBottom: 40,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  wordmark: {
    fontFamily: fonts.brand,
    fontSize: 34,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    maxWidth: 260,
  },
  form: {
    gap: 0,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 8,
  },
  input: {
    fontFamily: fonts.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 15,
  },
  inputFocus: {
    borderColor: colors.primary,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.danger,
    fontSize: 13,
    marginTop: 12,
  },
  btn: {
    marginTop: 22,
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.7 },
  btnText: {
    fontFamily: fonts.body,
    color: colors.bg,
    fontWeight: "700",
    fontSize: 15,
  },
  footer: {
    fontFamily: fonts.body,
    textAlign: "center",
    color: colors.textDim,
    fontSize: 12,
    marginTop: 36,
  },
});
