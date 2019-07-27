import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";
import { Base, Image } from "react-native";
import { Text, Button } from "../components";
import { Video } from "expo-av";

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
      <View style={{ backgroundColor: "#212529", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              { height: 350, width: screen.width },
              this.fadeIn(200, -20)
            ]}
          >
            <Video
              source={{
                uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
              }}
              rate={1.0}
              volume={1.0}
              isMuted={true}
              resizeMode="cover"
              rate={this.props.isActive ? 1 : 0}
              isLooping
              style={{ flex: 1, height: 350 }}
            />
            {/* <Video
              source={require("./add-roast.mp4")}
              isMuted
              isLooping
              resizeMode="cover"
              style={{
                width: 275,
                height: 275
              }}
            /> */}
          </Animated.View>
          <View style={{ padding: 16 }}>
            <Animated.View style={this.fadeIn(0, 20)}>
              <Animated.Text style={[styles.h2]}>
                Using Roast Buddy, prepare to record your roast details.
              </Animated.Text>
              <Text style={styles.subheading}>
                Press the record button in the tab bar. Then select your bean,
                and press 'start' once you have begun roasting.
              </Text>
              <View
                style={{
                  alignSelf: "stretch",
                  marginTop: 16,
                  justifyContent: "flex-end"
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
            </Animated.View>
          </View>
        </View>
        {/* <View style={{ padding: 16, paddingBottom: 72 }}>
          <Button
            onPress={this.props.onRequestNext}
            alignSelf="center"
            size="large"
            intent="primary"
          >
            Next
          </Button>
        </View> */}
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

    marginBottom: 16,
    lineHeight: 28
  },
  subheading: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 0,
    lineHeight: 24,
    marginBottom: 8
  }
});

export default TutorialPane;
