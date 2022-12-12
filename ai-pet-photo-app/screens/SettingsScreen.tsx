// Create a screen that allows users to manage their subscription and data usage

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "@rneui/base";
import { useTheme, useThemeMode } from "@rneui/themed";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const { theme } = useTheme();
  const { setMode } = useThemeMode();

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setMode(isEnabled ? "light" : "dark");
  };

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text>Dark mode:</Text>
        <Switch value={isEnabled} onValueChange={toggleSwitch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
