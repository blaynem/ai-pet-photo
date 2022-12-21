import {
  IconDefinition,
  faHouse,
  faUser,
  faImages,
  faCog,
  faPaw,
  faBurger,
  faList,
  faBars,
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
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.background,
          tabBarStyle: {
            backgroundColor: theme.colors.text,
          },
          headerStyle: { backgroundColor: theme.colors.background },

          headerBackground: () => {
            return (
              <View style={{ backgroundColor: theme.colors.background }}></View>
            );
          },
          headerTintColor: theme.colors.text,
          tabBarIcon: ({ color, size }) => {
            let iconName: IconDefinition = faHouse;
            switch (route.name) {
              case "Projects":
                iconName = faPaw;
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
              style={{ marginRight: 20, padding: 15 }}
            >
              <FontAwesomeIcon
                icon={faBars}
                size={30}
                color={theme.colors.text}
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
              color: theme.colors.text,
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
              color: theme.colors.text,
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}
