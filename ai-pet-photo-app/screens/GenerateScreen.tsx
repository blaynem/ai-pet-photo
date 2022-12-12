// Create a new screen that accepts a model and has an input for tags to generate new photos for the model

import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Model, RootStackParamList } from "../types";
import { RouteProp } from "@react-navigation/native";
import { useProjectContext } from "../state/context/ProjectContext";
import { Input } from "@rneui/themed";

type GenerateScreenRouteProp = RouteProp<RootStackParamList, "Generate">;

export const GenerateScreen = () => {
  const { state, dispatch } = useProjectContext();
  const project = state.project;
  console.log(project);
  const input = React.createRef();

  return (
    <View style={styles.container}>
      <Text>Generate Screen</Text>
      <Text>{project.name}</Text>
      <Input style={styles.input} placeholder="Tags" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});
