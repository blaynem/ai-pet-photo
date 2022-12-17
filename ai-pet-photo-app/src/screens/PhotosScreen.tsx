// TODO: Create a screen that displays all photos for a model in a grid with a title and image, and a button to add a new photo

import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { StatusBar } from "expo-status-bar";
import { useThemeContext } from "../../state/context/ThemeContext";

export default function PhotosScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { darkMode, theme } = useThemeContext().state;

  const photos = [
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
        data={photos}
        renderItem={({ item }) => (
          <View style={styles.photo}>
            <Image
              style={styles.image}
              source={{ uri: "https://picsum.photos/150/150" }}
              borderRadius={20}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    margin: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  title: {
    textAlign: "center",
  },
});
