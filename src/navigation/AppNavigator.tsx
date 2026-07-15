import { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { ZonaProvider, useZonaActiva } from "../context/ZonaContext";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AlertasScreen from "../screens/AlertasScreen";
import HistorialScreen from "../screens/HistorialScreen";
import EstadoScreen from "../screens/EstadoScreen";
import ConfigScreen from "../screens/ConfigScreen";
import AdminScreen from "../screens/AdminScreen";
import LoadingView from "../components/LoadingView";
import ToastBanner from "../components/ToastBanner";
import {
  startAlertNotifications,
  stopAlertNotifications,
} from "../services/notifications";
import { colors, fonts } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgMid,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const glyph: Record<string, string> = {
    Home: "◉",
    Alerts: "!",
    History: "≡",
    Nodes: "⊕",
    Settings: "⊙",
    Admin: "◆",
  };
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.iconGlyph, focused && styles.iconGlyphActive]}>
        {glyph[label] || "·"}
      </Text>
    </View>
  );
}

function AlertNotifier() {
  const { zonaId, tenantId } = useZonaActiva();
  useEffect(() => {
    startAlertNotifications({ zonaId, tenantId });
    return () => stopAlertNotifications();
  }, [zonaId, tenantId]);
  return <ToastBanner />;
}

function MainTabs() {
  const { logout, user } = useAuth();
  const showAdmin = user?.rol === "admin" || user?.rol === "superadmin";

  return (
    <>
      <AlertNotifier />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: colors.bg,
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderSoft,
          },
          headerTitleStyle: {
            fontFamily: fonts.body,
            fontWeight: "600",
            fontSize: 16,
            color: colors.text,
          },
          headerTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: colors.borderSoft,
            borderTopWidth: 1,
            height: 62,
            paddingTop: 4,
            paddingBottom: 6,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            letterSpacing: 0.2,
          },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textDim,
          tabBarIcon: ({ focused }) => (
            <TabIcon label={route.name} focused={focused} />
          ),
          headerRight: () => (
            <Pressable onPress={logout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          ),
          headerTitle: "Leafgrid",
        })}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{ title: "Home" }}
        />
        <Tab.Screen name="Alerts" component={AlertasScreen} />
        <Tab.Screen name="History" component={HistorialScreen} />
        <Tab.Screen name="Nodes" component={EstadoScreen} />
        <Tab.Screen name="Settings" component={ConfigScreen} />
        {showAdmin ? (
          <Tab.Screen name="Admin" component={AdminScreen} />
        ) : null}
      </Tab.Navigator>
    </>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, validating } = useAuth();

  if (validating) return <LoadingView message="Authenticating…" />;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main">
            {() => (
              <ZonaProvider>
                <MainTabs />
              </ZonaProvider>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 28,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {},
  iconGlyph: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: "700",
  },
  iconGlyphActive: { color: colors.primary },
  logoutBtn: {
    marginRight: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 13,
  },
});
