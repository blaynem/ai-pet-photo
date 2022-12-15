import * as React from "react";
import {
  View,
  Text,
  Button,
  StatusBar,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";
import ModelsScreen from "./src/screens/ProjectsScreen";
import PhotosScreen from "./src/screens/PhotosScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { GenerateScreen } from "./src/screens/GenerateScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faHouse,
  faImages,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { navigationRef } from "./navigationConfig";
import { LandingScreen } from "./src/screens/LandingScreen";
import { ProjectContextProvider } from "./state/context/ProjectContextProvider";
import Constants from "expo-constants";
import SelectImages from "./src/components/SelectImages";
import {
  ThemeContextProvider,
  useThemeContext,
} from "./state/context/ThemeContext";

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <NavigationContainer ref={navigationRef}>
        <ThemeContextProvider>
          <ProjectContextProvider>
            <OverLays />
          </ProjectContextProvider>
        </ThemeContextProvider>
      </NavigationContainer>
    </View>
  );
}

function OverLays() {
  const theme = useThemeContext().state.theme;
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerStyle: { backgroundColor: theme.colors.background },
          }}
        />
        <Stack.Screen name="Generate" component={GenerateScreen} />
      </Stack.Navigator>
    </>
  );
}

function Root() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconDefinition = faHouse;
          switch (route.name) {
            case "Home":
              iconName = faHouse;
              break;
            case "Projects":
              iconName = faUser;
              break;
            case "Photos":
              iconName = faImages;
              break;
            case "Settings":
              iconName = faCog;
              break;
          }

          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              navigationRef.current?.navigate("Settings");
            }}
            style={{ marginRight: 20 }}
          >
            <FontAwesomeIcon icon={faCog} size={20} color="#000" />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Projects" component={ModelsScreen} />
      <Tab.Screen name="Photos" component={PhotosScreen} />
    </Tab.Navigator>
  );
}

export default App;
