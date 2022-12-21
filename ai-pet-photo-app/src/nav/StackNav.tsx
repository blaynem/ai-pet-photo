import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useThemeContext } from "../../state/context/ThemeContext";
import { RootStackParamList } from "../../types";
import { GenerateScreen } from "../screens/GenerateScreen";
import { LandingScreen } from "../screens/LandingScreen";
import { NewProjectScreen } from "../screens/NewProjectScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Root } from "./TabsNav";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function OverLays() {
  const { theme, darkMode } = useThemeContext().state;

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} translucent={true} />
      <Stack.Navigator
        screenOptions={() => ({
          headerStyle: { backgroundColor: theme.colors.background },
        })}
      >
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{
            headerShown: false,
            statusBarColor: theme.colors.background,
          }}
        />
        <Stack.Screen
          name="Root"
          component={Root}
          options={{
            headerShown: false,
            statusBarColor: theme.colors.background,
            animation: "flip",
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.text,
            },
            statusBarColor: theme.colors.background,
          }}
        />
        <Stack.Screen
          name="Generate"
          component={GenerateScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.text,
            },

            statusBarColor: theme.colors.background,
          }}
        />
        <Stack.Screen
          name="NewProject"
          component={NewProjectScreen}
          options={{
            title: "New Project",
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.text,
            },

            statusBarColor: theme.colors.background,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
