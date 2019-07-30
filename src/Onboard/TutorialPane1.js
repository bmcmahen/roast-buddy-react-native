import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  LinkingIOS
} from "react-native";
import { Base } from "react-native";
import { Button, Text } from "../components";

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
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
            paddingBottom: 60
          }}
          style={{ flex: 1 }}
        >
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
              1
            </Text>
          </View>
          <Animated.Text
            style={[{ textAlign: "center" }, styles.h1, this.fadeIn(0, -20)]}
          >
            You will need...
          </Animated.Text>
          <View style={{ paddingHorizontal: 16, flex: 1 }}>
            <Animated.View style={this.fadeIn(50, 20)}>
              <Animated.Text style={[styles.h2]}>
                a well ventilated area
              </Animated.Text>
              <Text style={styles.subheading}>
                Roasting coffee can sometimes be a bit smokey, and smelly. Try
                doing it outside or near a window.
              </Text>
            </Animated.View>
            <Animated.View style={this.fadeIn(100, 20)}>
              <Animated.Text style={[styles.h2]}>
                a popcorn popper
              </Animated.Text>
              <Text style={styles.subheading}>
                You can roast coffee with most hot-air popcorn poppers. Just
                make sure that the{" "}
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
                >
                  hot air enters the popcorn chamber from side vents.
                </Text>
              </Text>
            </Animated.View>
            <Animated.View style={this.fadeIn(150, 20)}>
              <Animated.Text style={[styles.h2]}>green coffee</Animated.Text>
              <Text style={styles.subheading}>
                You can find green, unroasted coffee online.
              </Text>
            </Animated.View>
            <Animated.View style={this.fadeIn(200, 20)}>
              <Animated.Text style={[styles.h2]}>
                optionally, a wire colander and kitchen scale
              </Animated.Text>
              <Text style={styles.subheading}>
                A kitchen scale helps give consistency to your roasts, while a
                wire colander will help you cool down the beans once roasted.
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
        <View style={{ padding: 16, paddingBottom: 72 }}>
          <Button
            onPress={this.props.onRequestNext}
            alignSelf="center"
            size="large"
            intent="primary"
          >
            Next
          </Button>
        </View>
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
    padding: 3,
    marginBottom: 0
    // backgroundColor: 'black'
  },
  h2: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center"
  },
  subheading: {
    color: "rgba(255,255,255,0.8)",
    maxWidth: 500,
    fontSize: 14,
    marginTop: 0,
    lineHeight: 18,
    textAlign: "center"
  }
});

export default TutorialPane;
