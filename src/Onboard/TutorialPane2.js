import React from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { Text, Button, Base } from "../components";
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
    return (
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 40,
          paddingBottom: 60
        }}
        style={{ backgroundColor: "#212529", flex: 1 }}
      >
        <SafeAreaView>
          <View
            style={{
              paddingVertical: 32,
              paddingHorizontal: 16,
              flex: 1
            }}
          >
            <Animated.Text style={[styles.h2]}>
              Add beans to your popper and place a bowl to catch the chaff.
            </Animated.Text>
            <Text style={styles.subheading}>
              You should add enough beans such that they continue to "dance"
              around the popper, but not too vigourously. Generally, the fewer
              beans you add, the slower your roast will be.
            </Text>

            <Animated.Text style={[styles.h2]}>
              Listen and watch your coffee.
            </Animated.Text>
            <Text style={styles.subheading}>
              As coffee roasts it will eventually emit a "crack" sound. The
              first phase of cracks indicates a light roast, while the second
              phase indicates a medium roast.
            </Text>

            <Animated.Text style={[styles.h2]}>
              Remove coffee from the popper when desired, and cool it using the
              mesh collandar.
            </Animated.Text>
            <Text style={styles.subheading}>
              Your beans can be removed any time after the first crack.
              Typically, your roast duration will run somewhere between 6 to 12
              minutes, depending on how dark you roast your coffee.
            </Text>

            <Animated.Text style={[styles.h2]}>
              Once cooled, store your coffee in an old coffee bag.
            </Animated.Text>
            <Text style={styles.subheading}>
              Over the coming weeks the beans will release carbon, so be careful
              about storing the beans in air-tight containers. After three or
              four days, your coffee should be ready to drink.
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
        </SafeAreaView>
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
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
    padding: 3,
    marginBottom: 0,
    textAlign: "center"
  },
  h2: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28
  },
  subheading: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 0,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24
  }
});

export default TutorialPane;
