// @flow
import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { Text, Icon } from "../components";

const EmptyHint = () => {
  const screen = Dimensions.get("window");
  return (
    <View style={[styles.hint, { width: screen.width }]}>
      <Text small style={styles.text}>
        <Text small bold>
          Tap on the plus button
        </Text>{" "}
        to add or record your first roast.
      </Text>
      <Icon mt={1} mb={0} name="chevron-down" />
    </View>
  );
};

const styles = StyleSheet.create({
  hint: {
    height: 110,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#eee"
  },
  text: {
    width: 250,
    textAlign: "center"
  }
});

export default EmptyHint;
