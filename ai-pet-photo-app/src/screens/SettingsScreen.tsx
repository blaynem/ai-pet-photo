// Create a screen that allows users to manage their subscription and data usage

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "@rneui/base";
import { useThemeContext } from "../../state/context/ThemeContext";
import { toggleDarkModeAction } from "../../state/actions/Theme/toggleDarkModeAction";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const themeContext = useThemeContext();
  const toggleSwitch = () => {
    themeContext.dispatch(toggleDarkModeAction(!isEnabled));
    setIsEnabled((previousState) => !previousState);
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
