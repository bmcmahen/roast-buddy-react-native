import React from "react";
import { View, StyleSheet, ScrollView, Animated } from "react-native";
import { Button, Text } from "../components";
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
      toValue: 5000,
      duration: 4000
    }).start();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#212529" }}>
        <ScrollView style={{ flex: 1 }}>
          <SafeAreaView style={{ padding: 16 }}>
            <Text
              style={[
                styles.h1,
                {
                  paddingVertical: 32,
                  paddingHorizontal: 16
                }
              ]}
            >
              Things you will need
            </Text>
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
              <View>
                <Text style={[styles.h2]}>A well ventilated area.</Text>
                <Text style={styles.subheading}>
                  Roasting coffee can sometimes be a bit smokey, and smelly. Try
                  doing it outside or near a window.
                </Text>
              </View>
              <View>
                <Text style={[styles.h2]}>A popcorn popper.</Text>
                <Text style={styles.subheading}>
                  You can roast coffee with most hot-air popcorn poppers. Just
                  make sure that the{" "}
                  <Text bold color="white" small>
                    hot air enters the popcorn chamber from side vents.
                  </Text>{" "}
                  Of course, you can always use a speciality made coffee roaster
                  too.
                </Text>
              </View>
              <View>
                <Text style={[styles.h2]}>Some green coffee.</Text>
                <Text style={styles.subheading}>
                  You can find green, unroasted coffee online. Sometimes you can
                  ask your local coffee roaster for some green beans, too.
                </Text>
              </View>
              <View>
                <Text style={[styles.h2]}>
                  Optionally, a wire colander and kitchen scale.
                </Text>
                <Text style={styles.subheading}>
                  A kitchen scale helps give consistency to your roasts, while a
                  wire colander will help you cool down the beans once roasted.
                </Text>
              </View>
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
      </View>
    );
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      marginBottom: 16,
      maxWidth: 350,
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
