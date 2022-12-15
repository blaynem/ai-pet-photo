// create new screen to upload images to send to backend to make a project

import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { RouteProp } from "@react-navigation/native";
import { useProjectContext } from "../../state/context/ProjectContext";
import { Input } from "@rneui/themed";
