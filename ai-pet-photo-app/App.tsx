import * as React from "react";
import { View, Text, Button, Touchable, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";
import ModelsScreen, { ProjectsScreen } from "./src/screens/ProjectsScreen";
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
import { theme } from "./styles";
import { StatusBar } from "expo-status-bar";
import { OverLays } from "./src/nav/StackNav";

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <View style={{ flex: 1 }}>
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

export default App;
