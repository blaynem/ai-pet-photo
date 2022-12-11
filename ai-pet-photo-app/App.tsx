import * as React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import ModelsScreen from "./screens/ModelsScreen";
import PhotosScreen from "./screens/PhotosScreen";
import SettingsScreen from "./screens/SettingsScreen";

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

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Models" component={ModelsScreen} />
        <Stack.Screen name="Photos" component={PhotosScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
