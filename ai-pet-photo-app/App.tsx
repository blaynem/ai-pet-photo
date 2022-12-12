import * as React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";
import ModelsScreen from "./screens/ModelsScreen";
import PhotosScreen from "./screens/PhotosScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { GenerateScreen } from "./screens/GenerateScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faHouse,
  faImages,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { navigationRef } from "./navigationConfig";
import { LandingScreen } from "./screens/LandingScreen";
import { ProjectContextProvider } from "./state/context/ProjectContextProvider";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
            case "Models":
              iconName = faUser;
              break;
            case "Photos":
              iconName = faImages;
              break;
            case "Settings":
              iconName = faCog;
              break;
            case "Generate":
              iconName = faPlus;
              break;
          }

          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Models" component={ModelsScreen} />
      <Tab.Screen name="Photos" component={PhotosScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <ProjectContextProvider>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Root" component={Root} />

          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Generate" component={GenerateScreen} />
        </Stack.Navigator>
      </ProjectContextProvider>
    </NavigationContainer>
  );
}

export default App;
