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
import { RootStackParamList } from "../types";

export const ModelsScreen = ({ navigation }: any) => {
  const models = [
    {
      id: "1",
      name: "Dog",
    },
    {
      id: "2",
      name: "Cat",
    },
    {
      id: "3",
      name: "Bird",
    },
    {
      id: "4",
      name: "Fish",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={models}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.model}
            onPress={() => {
              navigate("Root", { screen: "Generate", params: { model: item } });
            }}
          >
            <Image
              style={styles.image}
              source={{ uri: "https://picsum.photos/100/100" }}
            />
            <Text style={styles.title}>{item.name}</Text>
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
