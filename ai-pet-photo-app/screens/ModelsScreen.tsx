//TODO: Create a screen that displays a list of models displayed in a grid with a title and image, and a button to add a new model

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { navigate } from "../navigationConfig";
import { setProjectAction } from "../state/actions/Projects/setProjectAction";
import { useProjectContext } from "../state/context/ProjectContext";
import { Project, RootStackParamList } from "../types";

export const ModelsScreen = ({ navigation }: any) => {
  const { state, dispatch } = useProjectContext();

  const handleProjectPress = async (project: Project) => {
    await dispatch(setProjectAction(project));
    console.log("dispatched");
    navigate("Generate");
  };
  const projects: Project[] = [
    {
      id: "1",
      name: "Dog",
      images: ["swag"],
    },
    {
      id: "2",
      name: "Cat",
      images: ["swag"],
    },
    {
      id: "3",
      name: "Bird",
      images: ["swag"],
    },
    {
      id: "4",
      name: "Fish",
      images: ["swag"],
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.model}
            onPress={() => handleProjectPress(item)}
          >
            <Image
              style={styles.image}
              source={{ uri: "https://picsum.photos/100/100" }}
            />
            <Text style={styles.title}>{item.name} </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  model: {
    margin: 10,
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ModelsScreen;
