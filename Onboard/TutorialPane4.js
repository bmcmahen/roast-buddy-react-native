import React from "react";
import { View, StyleSheet, ScrollView, Animated } from "react-native";
import { Image } from "react-native";
import { Text, Base, Button } from "../components";

class TutorialPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    console.log("did mount");
    Animated.timing(this.state.anim, {
      toValue: 3000,
      duration: 5000
    }).start();
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 40,
          paddingBottom: 60
        }}
        style={{ paddingBottom: 60, backgroundColor: "black", flex: 1 }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Animated.View style={this.fadeIn(0, 20)}>
            <Base alignItems="center" flex={1}>
              <View
                style={{
                  width: 50,
                  marginBottom: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "white"
                }}
              >
                <Text giant color="white">
                  5
                </Text>
              </View>
            </Base>
            <Animated.Text style={[styles.h2]}>
              Remove coffee from the popper when desired, and cool it using the
              mesh collandar.
            </Animated.Text>
            <Text style={styles.subheading}>
              Your beans can be removed any time after the first crack.
              Typically, your roast duration will run somewhere between 6 to 12
              minutes, depending on how dark you roast your coffee.
            </Text>
          </Animated.View>
          <Animated.View style={this.fadeIn(500, 20)}>
            <Base alignItems="center" flex={1} mt={3}>
              <View
                style={{
                  width: 50,
                  marginBottom: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "white"
                }}
              >
                <Text giant color="white">
                  6
                </Text>
              </View>
            </Base>
            <Animated.Text style={[styles.h2]}>
              Once cooled, store your coffee in an old coffee bag.
            </Animated.Text>
            <Text style={styles.subheading}>
              Over the coming weeks the beans will release carbon, so be careful
              about storing the beans in air-tight containers. After three or
              four days, your coffee should be ready to drink.
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
    marginBottom: 0
  },
  h2: {
    color: "white",
    maxWidth: 500,
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
