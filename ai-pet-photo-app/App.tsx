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
import ModelsScreen from "./screens/ProjectsScreen";
import PhotosScreen from "./screens/PhotosScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { GenerateScreen } from "./screens/GenerateScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faHouse,
  faImages,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { navigationRef } from "./navigationConfig";
import { LandingScreen } from "./screens/LandingScreen";
import { ProjectContextProvider } from "./state/context/ProjectContextProvider";
import { ThemeProvider, createTheme, Icon } from "@rneui/themed";
import Constants from "expo-constants";

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const theme = createTheme({
  components: {
    Button: {
      raised: true,
    },
  },
  lightColors: {
    primary: "#899656",
  },
  darkColors: {
    primary: "#344512",
  },
  mode: "light",
});

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
};

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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ModelsScreen} />
      <Tab.Screen name="Photos" component={PhotosScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <NavigationContainer ref={navigationRef}>
        <ThemeProvider theme={theme}>
          <ProjectContextProvider>
            <Stack.Navigator>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen
                name="Root"
                component={Root}
                options={{ header: () => <View></View> }}
              />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Generate" component={GenerateScreen} />
            </Stack.Navigator>
          </ProjectContextProvider>
        </ThemeProvider>
      </NavigationContainer>
    </View>
  );
}

export default App;
