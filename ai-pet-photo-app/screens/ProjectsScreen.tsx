/* eslint-disable jsx-a11y/alt-text */
//TODO: Create a screen that displays a list of models displayed in a grid with a title and image, and a button to add a new model

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Card } from "@rneui/themed";
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
import { Project } from "../types";

export const ProjectsScreen = ({ navigation }: any) => {
  const { state, dispatch } = useProjectContext();

  const handleProjectPress = async (project: Project) => {
    await dispatch(setProjectAction(project));
    console.log("dispatched");
    navigate("Generate");
  };

  const handleCreateNewProject = () => {
    navigate("CreateProject");
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
    {
      id: "new",
      name: "Create New Project",
      images: ["swag"],
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => {
          return item.id !== "new" ? (
            <TouchableOpacity onPress={() => handleProjectPress(item)}>
              <Card>
                <Image
                  style={styles.image}
                  source={{ uri: "https://picsum.photos/100/100" }}
                />
                <Card.Divider />
                <Card.Title style={{ marginBottom: 0, paddingBottom: 0 }}>
                  {" "}
                  {item.name}
                </Card.Title>
              </Card>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleCreateNewProject()}>
              <Card>
                <View style={styles.newProj}>
                  <Text>
                    <FontAwesomeIcon icon={faPlus} />
                  </Text>
                </View>
                <Card.Divider />
                <Card.Title style={{ marginBottom: 0, paddingBottom: 0 }}>
                  New Project
                </Card.Title>
              </Card>
            </TouchableOpacity>
          );
        }}
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
    paddingBottom: 40,
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
    borderRadius: 10,
    marginBottom: 10,
  },
  newProj: {
    width: 100,
    height: 100,
    marginRight: 0,
    borderRadius: 10,
    marginBottom: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProjectsScreen;
