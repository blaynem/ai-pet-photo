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
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

export default function ModelsScreen() {
  const navigation = useNavigation();

  const models = [
    {
      id: "1",
      title: "Dog",
    },
    {
      id: "2",
      title: "Cat",
    },
    {
      id: "3",
      title: "Bird",
    },
    {
      id: "4",
      title: "Fish",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={models}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.model}
            /* TODO: Add a button to navigate to a screen to generate new photos for the model
            onPress={() => navigation.navigate("Photos", { model: item })}
            */
          >
            <Image
              style={styles.image}
              source={{ uri: "https://picsum.photos/100/100" }}
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
}

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
