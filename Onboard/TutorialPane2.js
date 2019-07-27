import React from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { Text, Button, Base } from "../components";

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
    return (
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          paddingBottom: 60
        }}
        style={{ backgroundColor: "black", flex: 1 }}
      >
        <View
          style={{ paddingHorizontal: 16, flex: 1, justifyContent: "center" }}
        >
          <Animated.View style={this.fadeIn(0, 20)}>
            <Base alignItems="center" flex={1}>
              <View
                style={{
                  width: 50,
                  marginBottom: 16,
                  marginTop: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "white"
                }}
              >
                <Text giant color="white">
                  3
                </Text>
              </View>
            </Base>
            <Animated.Text style={[styles.h2]}>
              Add beans to your popper and place a bowl to catch the chaff.
            </Animated.Text>
            <Text style={styles.subheading}>
              You should add enough beans such that they continue to "dance"
              around the popper, but not too vigourously. Generally, the fewer
              beans you add, the slower your roast will be.
            </Text>
          </Animated.View>

          <Animated.View style={this.fadeIn(500, 20)}>
            <Base alignItems="center" flex={1} mt={3}>
              <View
                style={{
                  width: 50,
                  marginTop: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "white"
                }}
              >
                <Text giant color="white">
                  4
                </Text>
              </View>
            </Base>
            <Animated.Text style={[styles.h2]}>
              Listen and watch your coffee.
            </Animated.Text>
            <Text style={styles.subheading}>
              As coffee roasts it will eventually emit a "crack" sound. The
              first phase of cracks indicates a light roast, while the second
              phase indicates a medium roast.
            </Text>
          </Animated.View>

          <Button
            onPress={this.props.onRequestNext}
            alignSelf="center"
            mt={3}
            small
            style={{ borderColor: "white" }}
            outline
          >
            <Text color="white">Next</Text>
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
    textAlign: "center",
    marginBottom: 20
  },
  h2: {
    color: "white",
    fontSize: 22,
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
