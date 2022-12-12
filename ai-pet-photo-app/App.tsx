import * as React from "react";
import { View, Text, Button } from "react-native";
import {
  createNavigationContainerRef,
  NavigationContainer,
  StackActions,
} from "@react-navigation/native";
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
import {
  icon,
  IconDefinition,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faHouse,
  faImages,
  faMugSaucer,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { navigationRef } from "./navigationConfig";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go To Models"
        onPress={() => props.navigation.push("Models")}
      ></Button>
      <Button
        title="Go To Photos"
        onPress={() => props.navigation.push("Photos")}
      ></Button>
      <Button
        title="Go To Settings"
        onPress={() => props.navigation.push("Settings")}
      ></Button>
    </View>
  );
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
function Root() {}

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
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

            return (
              <FontAwesomeIcon icon={iconName} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Models" component={ModelsScreen} />
        <Tab.Screen name="Photos" component={PhotosScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Generate" component={GenerateScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
