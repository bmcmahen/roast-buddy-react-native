import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Button, Base, Image, config } from "../components";

class Onboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.fadeIn();
  }

  fadeIn() {
    Animated.timing(this.state.opacity, { toValue: 1, duration: 1000 }).start();
  }

  fadeOut() {
    Animated.timing(this.state.opacity, { toValue: 0, duration: 1000 }).start();
  }

  render() {
    return (
      <Base flex={1} style={{ overflow: "hidden" }}>
        <Image
          fade
          resizeMode="cover"
          source={require("../Profile/coffee-4.jpg")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            opacity: this.state.opacity
          }}
        />
        <Base flex={1} align="center" justify="center" column p={2} pt={4}>
          <Image
            style={styles.logo}
            source={require("../../assets/icons/1024.png")}
          />
          <Animated.Text style={styles.title}>Roast Buddy</Animated.Text>
          <Animated.Text style={styles.blurb}>
            Your coffee roasting companion.
          </Animated.Text>
        </Base>
        <Base height={300} column align="center" px={3}>
          <Button
            block
            size="large"
            intent="primary"
            onPress={() => {
              this.props.onRequestNext();
            }}
            mt={3}
            alignSelf="center"
          >
            Learn how Roast Buddy works
          </Button>
          <Button
            alignSelf="center"
            textColor="white"
            variant="ghost"
            onPress={this.props.onFinish}
            mt={2}
          >
            Skip intro
          </Button>
        </Base>
      </Base>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 35,
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: "white",
    textAlign: "center"
  },
  blurb: {
    marginTop: 16,
    fontSize: 17,
    textAlign: "center",
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.9)"
  },
  logo: {
    width: 100,
    height: 100
  }
});

export default Onboard;
