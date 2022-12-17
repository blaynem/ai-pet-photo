import {
  IconDefinition,
  faHouse,
  faUser,
  faImages,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity } from "react-native";
import { navigationRef } from "../../navigationConfig";
import { useThemeContext } from "../../state/context/ThemeContext";
import { RootStackParamList } from "../../types";
import PhotosScreen from "../screens/PhotosScreen";
import ProjectsScreen from "../screens/ProjectsScreen";

const Tab = createBottomTabNavigator<RootStackParamList>();

export function Root() {
  const theme = useThemeContext().state.theme;
  const darkMode = useThemeContext().state.darkMode;
  return (
    <>
      <Tab.Navigator
        sceneContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: theme.colors.danger,
          tabBarInactiveTintColor: theme.colors.background,
          tabBarStyle: {
            backgroundColor: theme.colors.foreground,
          },
          headerStyle: { backgroundColor: theme.colors.background },

          headerBackground: () => {
            return (
              <View style={{ backgroundColor: theme.colors.background }}></View>
            );
          },
          headerTintColor: theme.colors.foreground,
          tabBarIcon: ({ color, size }) => {
            let iconName: IconDefinition = faHouse;
            switch (route.name) {
              case "Projects":
                iconName = faUser;
                break;
              case "Photos":
                iconName = faImages;
                break;
            }
            return (
              <FontAwesomeIcon icon={iconName} size={size} color={color} />
            );
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate("Settings");
              }}
              style={{ marginRight: 20 }}
            >
              <FontAwesomeIcon
                icon={faCog}
                size={20}
                color={theme.colors.foreground}
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.foreground,
            },
          }}
        />
        <Tab.Screen
          name="Photos"
          component={PhotosScreen}
          options={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.foreground,
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}
