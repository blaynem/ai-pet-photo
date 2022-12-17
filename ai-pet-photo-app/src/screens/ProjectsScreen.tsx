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
import { navigate } from "../../navigationConfig";
import { setProjectAction } from "../../state/actions/Projects/setProjectAction";
import { useProjectContext } from "../../state/context/ProjectContext";
import { useThemeContext } from "../../state/context/ThemeContext";
import { theme } from "../../styles";
import { Project } from "../../types";
import { StatusBar } from "expo-status-bar";

export const ProjectsScreen = ({ navigation }: any) => {
  const { state, dispatch } = useProjectContext();
  const themeContext = useThemeContext();
  const theme = themeContext.state.theme;
  const handleProjectPress = async (project: Project) => {
    await dispatch(setProjectAction(project));
    navigate("Generate");
  };

  const handleCreateNewProject = () => {
    navigate("CreateProject");
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      margin: 0,
      height: "100%",
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          height: "10%",
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
        style={{ width: "100%", height: "100%" }}
        data={projects}
        keyExtractor={(item) => item.id}
        numColumns={1}
        renderItem={({ item }) => {
          return (
            <ProjectListItem
              image={"https://picsum.photos/200"}
              title={item.name}
              onPress={() => handleProjectPress(item)}
            ></ProjectListItem>
          );
        }}
      />
    </View>
  );
};

const ProjectListItem = ({ image, title, onPress }: any) => {
  const themeContext = useThemeContext();
  const theme = themeContext.state.theme;
  const styles = StyleSheet.create({
    listItem: {
      border: "1px solid black",
      backgroundColor: theme.colors.background,
      marginTop: 10,
    },
    listItemInner: {
      width: "100%",
      height: "100%",
      flexDirection: "row",
    },
    image: {
      height: "100%",
      aspectRatio: 1,
      resizeMode: "contain",
      borderRadius: 10,
      marginBottom: 10,
      marginLeft: 10,
    },
    title: {
      fontSize: 15,
      paddingLeft: 10,
      fontWeight: "bold",
      color: theme.colors.foreground,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.listItem}>
      <View style={styles.listItemInner}>
        <Image style={styles.image} source={{ uri: image }} />
        <View style={{ display: "flex" }}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectsScreen;

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
    name: "Create New",
    images: ["swag"],
  },
];
