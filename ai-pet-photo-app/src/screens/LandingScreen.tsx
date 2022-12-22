// create a new landing screen to pop up as app opens

import React from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { RouteProp } from "@react-navigation/native";
import { navigate } from "../../navigationConfig";
import { useThemeContext } from "../../state/context/ThemeContext";
import { theme } from "../../styles";

export const LandingScreen = () => {
  const doThing = () => {
    const testUrl = "http://localhost:3000/api/test";
    console.log("tested url:", testUrl);
    const result = fetch(testUrl)
      .then((response) => {
        const resp = response.json();
        console.log("----response", resp);
        return resp;
      })
      .catch((error) => {
        console.error("---error", error);
      });
    console.log("----??", result);
  };
  const theme = useThemeContext().state.theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    section: {
      alignItems: "stretch",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.text,
    },
    header: {
      color: theme.colors.text,
      fontSize: theme.spacing.m,
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.container}>
      <Text>Landing Screen</Text>
      <Button title="DO API CALL" onPress={() => doThing()} />
      <Button title="Sign In" onPress={() => navigate("Root")} />
    </View>
  );

  // // create input to enter email and password

  // return (
  //   <View style={styles.container}>
  //     <View style={styles.section}>
  //       <Text style={styles.header}>Welcome to AI Pet Photo App</Text>
  //       <Text style={styles.text}>Please sign in to continue</Text>
  //     </View>
  //     <View style={styles.section}>
  //       <TextInput placeholder="Email" />
  //       <TextInput placeholder="Password" />

  //       <Button title="Sign In" onPress={() => navigate("Root")} />
  //     </View>
  //     <View style={styles.section}>
  //       <Text>Or, sign up for a new account</Text>
  //       <Button title="Sign Up" onPress={() => navigate("Root")} />
  //     </View>
  //   </View>
  // );
};
