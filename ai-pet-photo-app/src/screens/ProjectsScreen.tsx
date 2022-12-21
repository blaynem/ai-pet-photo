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
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { navigate } from "../../navigationConfig";
import { setProjectAction } from "../../state/actions/Projects/setProjectAction";
import { useProjectContext } from "../../state/context/ProjectContext";
import { useThemeContext } from "../../state/context/ThemeContext";
import { Project } from "../../types";
import { ProjectListItem } from "../components/ProjectLIstItem";

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
    newProjButton: {
      height: 60,
      marginTop: 20,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      borderRadius: 30,
      display: "flex",
      padding: 10,
      marginBottom: 10,
    },
  });

  return (
    <ScrollView>
      <SafeAreaView
        style={{
          alignItems: "center",
        }}
      >
        {/* Create list item at top to create a new project */}
        <TouchableOpacity
          onPress={() => navigate("NewProject")}
          style={styles.newProjButton}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              paddingBottom: 3,
              paddingLeft: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size={30}
              color={theme.colors.text}
              style={{ marginRight: 10 }}
            />
            <Text style={{ fontSize: 18, color: theme.colors.text }}>
              Create New Project
            </Text>
          </View>
        </TouchableOpacity>

        {projects.map((item, i) => {
          return (
            <ProjectListItem
              key={item.id}
              image={"https://picsum.photos/200"}
              title={item.name}
              onPress={() => handleProjectPress(item)}
              isFirst={i === 0}
              isLast={i === projects.length - 1}
            />
          );
        })}
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProjectsScreen;
//TODO:  create projects array of type Project[] object  with fields id as a string, name as the name of a pet, type as the type of animal the pet is, and images with links to images of the pet

const projects: Project[] = [
  {
    id: "1",
    name: "Teddy",
    type: "Dog",
    images: ["https://picsum.photos/200"],
  },
  {
    id: "2",
    name: "Vincent",
    type: "Cat",
    images: ["https://picsum.photos/200"],
  },
  {
    id: "3",
    name: "Bella",
    type: "Bird",
    images: ["https://picsum.photos/200"],
  },
  {
    id: "4",
    name: "Nemo",
    type: "Fish",
    images: ["https://picsum.photos/200"],
  },
  {
    id: "5",
    name: "Spike",
    type: "Reptile",
    images: ["https://picsum.photos/200"],
  },
  {
    id: "6",
    name: "Jerry",
    type: "Rodent",
    images: ["https://picsum.photos/200"],
  },
  {
    id: "7",
    name: "Donald Trump",
    type: "Other",
    images: ["https://picsum.photos/200"],
  },
];
