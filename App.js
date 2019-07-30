import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Platform, StatusBar, StyleSheet, View, YellowBox } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Container from "./Container";

YellowBox.ignoreWarnings([
  "Require cycle:",
  "ListView is deprecated",
  "Remote debugger",
  "Each child",
  "Keys should be"
]);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <Container />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/icons/1024.png"),
      require("./src/Profile/coffee-4.jpg"),
      require("./src/Onboard/add-roast.mp4"),
      require("./src/Profile/login.jpg")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Feather.font,
      ...Ionicons.font
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
