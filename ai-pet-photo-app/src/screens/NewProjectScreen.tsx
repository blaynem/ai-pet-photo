// create NewProject screen to upload images to send to backend to make a project

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { RouteProp } from "@react-navigation/native";
import { useProjectContext } from "../../state/context/ProjectContext";
import { Input } from "@rneui/themed";
import SelectImages from "../components/SelectImages";

export const NewProjectScreen = () => {
  const { state, dispatch } = useProjectContext();

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      backfaceVisibility: "visible",
    },
  });

  return (
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      <SafeAreaView style={styles.container}>
        <SelectImages />
      </SafeAreaView>
    </ScrollView>
  );
};
