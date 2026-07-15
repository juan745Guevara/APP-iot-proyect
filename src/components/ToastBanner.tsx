import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { subscribeToast, type ToastPayload } from "../services/notifications";
import { colors, fonts, radius } from "../theme";

export default function ToastBanner() {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const y = useRef(new Animated.Value(-72)).current;

  useEffect(() => {
    return subscribeToast((t) => {
      setToast(t);
      Animated.timing(y, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(y, {
          toValue: -72,
          duration: 180,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, 6500);
    });
  }, [y]);

  if (!toast) return null;

  return (
    <Animated.View
      style={[styles.wrap, { transform: [{ translateY: y }] }]}
      pointerEvents="box-none"
    >
      <Pressable
        style={[
          styles.card,
          toast.kind === "anomalia" ? styles.anomalia : styles.alerta,
        ]}
        onPress={() => setToast(null)}
      >
        <Text style={styles.title}>{toast.title}</Text>
        <Text style={styles.body}>{toast.body}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    backgroundColor: colors.surfaceAlt,
  },
  alerta: { borderColor: "rgba(239, 68, 68, 0.45)" },
  anomalia: { borderColor: "rgba(234, 179, 8, 0.45)" },
  title: {
    fontFamily: fonts.body,
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 4,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
