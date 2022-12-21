import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/* TODO: create submit button to submit images to the API*/

export default function SelectImages() {
  const [images, setImages] = useState([] as string[]);

  const addImage = async () => {
    let _image: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

    setImages(_image.assets ? _image?.assets.map((asset) => asset.uri) : []);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    images.forEach((image, i) => {
      formData.append("images", {
        name: `image${i}`,
        type: "image/jpg",
        uri: image,
      } as any);
    });
    const response = await fetch("http://localhost:3000/api/images", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <ScrollView contentContainerStyle={imageUploaderStyles.container}>
      <TouchableOpacity
        onPress={addImage}
        style={imageUploaderStyles.uploadBtn}
      >
        <AntDesign name="plus" size={24} color="black" />
        <Text style={imageUploaderStyles.uploadBtnText}>Upload Images</Text>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {images
          ? images.map((image) => (
              <Image
                source={{ uri: image }}
                style={imageUploaderStyles.image}
              />
            ))
          : null}
      </View>
      <TouchableOpacity
        style={imageUploaderStyles.uploadBtn}
        onPress={handleSubmit}
      >
        <Text>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  uploadBtnText: {
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
