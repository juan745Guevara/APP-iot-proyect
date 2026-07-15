import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { ZonaProvider } from "../context/ZonaContext";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AlertasScreen from "../screens/AlertasScreen";
import HistorialScreen from "../screens/HistorialScreen";
import EstadoScreen from "../screens/EstadoScreen";
import ConfigScreen from "../screens/ConfigScreen";
import LoadingView from "../components/LoadingView";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Inicio: "🏠",
    Alertas: "🔔",
    Historial: "📈",
    Estado: "📡",
    Config: "⚙️",
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {icons[label] || "•"}
    </Text>
  );
}

function MainTabs() {
  const { logout, user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        headerRight: () => (
          <Pressable onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Salir</Text>
          </Pressable>
        ),
        headerTitle: user?.usuario ? `Hola, ${user.usuario}` : "Invernadero",
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Historial" component={HistorialScreen} />
      <Tab.Screen name="Estado" component={EstadoScreen} />
      <Tab.Screen name="Config" component={ConfigScreen} options={{ title: "Configuración" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, validating } = useAuth();

  if (validating) return <LoadingView message="Validando sesión…" />;

  return (
    <NavigationContainer>
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
  logoutBtn: { marginRight: 14, padding: 6 },
  logoutText: { color: colors.danger, fontWeight: "600" },
});
