import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { colors, space } from "../theme";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export default function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
}: Props) {
  if (!scroll) {
    return (
      <View style={[styles.root, style]}>
        <View style={[styles.inner, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, style]}>
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: space.xl },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.xxl + 8,
    gap: space.lg,
  },
});
