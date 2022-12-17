// Create a new screen that accepts a model and has an input for tags to generate new photos for the model

import React from "react";
import { View, Text, StyleSheet, TextInput, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { RouteProp } from "@react-navigation/native";
import { useProjectContext } from "../../state/context/ProjectContext";
import { Input } from "@rneui/themed";
import { useThemeContext } from "../../state/context/ThemeContext";
import { theme } from "../../styles";

export const GenerateScreen = () => {
  const { state, dispatch } = useProjectContext();
  const theme = useThemeContext().state.theme;

  const project = state.project;
  const input = React.createRef();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      backfaceVisibility: "visible",
      backgroundColor: theme.colors.foreground,
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text>Generate Screen</Text>
      <Text>{project.name}</Text>
      <Input style={styles.input} placeholder="Tags" />
      <StatusBar backgroundColor={theme.colors.background}></StatusBar>
    </View>
  );
};
