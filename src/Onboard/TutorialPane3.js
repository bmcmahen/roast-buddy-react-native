import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
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
              source={require("./add-roast.mp4")}
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
                Using Roast Buddy, prepare to record your roast details.
              </Text>
              <Text style={styles.subheading}>
                Press the record button in the tab bar. Then select your bean,
                and press 'start' once you have begun roasting.
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
                <Button
                  onPress={this.props.onRequestNext}
                  size="small"
                  intent="primary"
                  style={{ alignSelf: "flex-start" }}
                >
                  Next
                </Button>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      marginBottom: 16,

      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: "clamp"
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: "clamp"
          })
        }
      ]
    };
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
