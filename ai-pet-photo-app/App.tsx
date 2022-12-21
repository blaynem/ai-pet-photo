import * as React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationConfig";
import { ProjectContextProvider } from "./state/context/ProjectContextProvider";
import { ThemeContextProvider } from "./state/context/ThemeContext";
import { OverLays } from "./src/nav/StackNav";

function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <ThemeContextProvider>
          <ProjectContextProvider>
            <OverLays />
          </ProjectContextProvider>
        </ThemeContextProvider>
      </NavigationContainer>
    </View>
  );
}

export default App;
