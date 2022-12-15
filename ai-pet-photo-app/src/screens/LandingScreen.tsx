// create a new landing screen to pop up as app opens

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { RouteProp } from "@react-navigation/native";
import { navigate } from "../../navigationConfig";

export const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Landing Screen</Text>
      <Button title="Sign In" onPress={() => navigate("Root")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
