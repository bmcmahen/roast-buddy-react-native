import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { Base, Image } from "react-native";
import { Text, Button } from "../components";
// import Video from 'react-native-video'

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
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 40,
          paddingBottom: 60
        }}
        style={{ paddingBottom: 60, backgroundColor: "black", flex: 1 }}
      >
        <View
          style={{
            width: 50,
            marginBottom: 16,
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: "white"
          }}
        >
          <Text giant color="white">
            7
          </Text>
        </View>
        <Animated.View
          style={[
            { height: 275, marginTop: 16, width: screen.width },
            this.fadeIn(200, -20)
          ]}
        >
          {/* <Video
          source={require('./save-roast.mp4')}
          repeat={true}
          muted={true}
          rate={this.props.isActive ? 1 : 0}
          key='video'
          resizeMode='cover'
          style={{
            width: screen.width,
            height: 275
          }}
        /> */}
        </Animated.View>
        <View style={{ padding: 0 }}>
          <Animated.View style={this.fadeIn(0, 20)}>
            <Animated.Text style={[styles.h2]}>
              In Roast Buddy, stop your timer, add additional details, and save.
            </Animated.Text>
            <Text style={styles.subheading}>
              You can add your roast degree, temperature, weight, and other
              notes. After you save your roast, you can also add tasting notes.
            </Text>
          </Animated.View>
          <Button
            large
            onPress={this.props.onRequestNext}
            alignSelf="center"
            mt={2}
            primary
          >
            Begin using Roast Buddy
          </Button>
        </View>
      </ScrollView>
    );
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
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
    maxWidth: 500,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center"
  },
  subheading: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 0,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 500,
    alignSelf: "center"
  }
});

export default TutorialPane;
