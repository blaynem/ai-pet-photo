// Create a screen that allows users to manage their subscription and data usage

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "@rneui/base";
import { useThemeContext } from "../../state/context/ThemeContext";
import { toggleDarkModeAction } from "../../state/actions/Theme/toggleDarkModeAction";
import { StatusBar } from "expo-status-bar";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const themeContext = useThemeContext();
  const [isEnabled, setIsEnabled] = React.useState(themeContext.state.darkMode);
  const { theme, darkMode } = themeContext.state;

  const toggleSwitch = () => {
    themeContext.dispatch(toggleDarkModeAction(!isEnabled));
    setIsEnabled((previousState) => !previousState);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text style={styles.text}>Dark mode:</Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          color={theme.colors.text}
        />
      </View>
    </View>
  );
}
