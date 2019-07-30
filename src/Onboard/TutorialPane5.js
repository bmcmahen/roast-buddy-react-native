import React from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { Text, Button } from "../components";
import { Video } from "expo-av";
import { SafeAreaView } from "react-navigation";

class TutorialPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.anim, {
      toValue: 3000,
      duration: 5000
    }).start();
  }

  render() {
    const screen = Dimensions.get("window");

    return (
      <View style={{ backgroundColor: "#1e1e1e", flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={[
              {
                flexDirection: "column",
                justifyContent: "flex-end",
                height: screen.height / 2,
                width: screen.width
              }
            ]}
          >
            <Video
              source={require("./save-roast.mp4")}
              rate={1.0}
              volume={1.0}
              isMuted={true}
              resizeMode="cover"
              rate={this.props.isActive ? 1 : 0}
              isLooping
              style={{ flex: 1, height: 350 }}
            />
          </View>
          <View style={{ padding: 16 }}>
            <View>
              <Text style={[styles.h2]}>
                In Roast Buddy, stop your timer, add additional details, and
                save.
              </Text>
              <Text style={styles.subheading}>
                You can add your roast degree, temperature, weight, and other
                notes. After you save your roast, you can also add tasting
                notes.
              </Text>
              <View
                style={{
                  alignSelf: "stretch",
                  marginTop: 16,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Button onPress={this.props.onRequestNext} intent="primary">
                  Begin using Roast Buddy
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  h1: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 0
  },
  h2: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 28
  },
  subheading: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 0,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8
  }
});

export default TutorialPane;
