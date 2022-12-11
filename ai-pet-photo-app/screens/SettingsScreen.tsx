// Create a screen that allows users to manage their subscription and data usage

// Path: ai-pet-photo-app\screens\SettingsScreen.tsx
// Create a screen that allows users to manage their subscription and data usage
//

// Path: ai-pet-photo-app\screens\SettingsScreen.tsx
// Create a screen that allows users to manage their subscription and data usage
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
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
