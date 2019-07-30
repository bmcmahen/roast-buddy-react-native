//@flow

import React from "react";

import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { skipIntro } from "../actions/settings";
import Onboard from "./OnboardNav";

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: props.settings.skipIntro
        ? new Animated.Value(0)
        : new Animated.Value(1),
      render: !props.settings.skipIntro
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.settings.skipIntro && !nextProps.settings.skipIntro) {
      this.setState({ render: true }, () => {
        Animated.timing(this.state.showing, {
          toValue: 1,
          duration: 1000
        }).start();
      });
    }
  }

  skipOrFinish() {
    console.log("skip or finish");
    this.props.dispatch(skipIntro());
    Animated.timing(this.state.showing, { toValue: 0, duration: 1000 }).start(
      () => {
        this.setState({ render: false });
      }
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.render && (
          <Animated.View
            style={[
              styles.modal,
              {
                opacity: this.state.showing
              }
            ]}
          >
            <Onboard onFinish={this.skipOrFinish.bind(this)} />
          </Animated.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white"
  }
});

function getState(state) {
  return {
    settings: state.settings
  };
}

export default connect(getState)(Intro);
