// @flow

import React from "react";
import { StyleSheet, Animated, View, Dimensions } from "react-native";
import shallowCompare from "react-addons-shallow-compare";
import { connect } from "react-redux";
import TabNavigator from "./AppNavigator2";
// import AddRoast from "./RecordRoast/navigator";
// import EditBean from "./BeanList/EditBean";
// import ViewRoast from "./RoastList/ViewRoast";

import { hideRecorder } from "../actions/recorder";

/**
 * MODAL NAVIGATOR
 */

class ModalNavigator extends React.Component {
  constructor(props) {
    super(props);
    const { open } = props.modalState;
    this.state = {
      open: new Animated.Value(open ? 1 : 0),
      renderModalContents: open
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    // open the modal
    if (nextProps.modalState.open && !this.props.modalState.open) {
      this._showModal();

      // close the modal
    } else if (!nextProps.modalState.open && this.props.modalState.open) {
      this._hideModal();
    }
  }

  _showModal() {
    this.setState({ renderModalContents: true });
    Animated.timing(this.state.open, {
      toValue: 1,
      duration: 300
    }).start();
  }

  _hideModal() {
    Animated.timing(this.state.open, {
      toValue: 0,
      duration: 300
    }).start(() => {
      this.setState({ renderModalContents: false });
    });
  }

  _back() {
    this.props.dispatch(hideRecorder);
  }

  render() {
    const screen = Dimensions.get("window");

    const translateY = this.state.open.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height, 0]
    });

    const scale = this.state.open.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
      extrapolate: "clamp"
    });

    const opacity = this.state.open.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.6],
      extrapolate: "clamp"
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.primaryContent,
            {
              opacity,
              transform: [
                {
                  scale
                }
              ]
            }
          ]}
        >
          <TabNavigator />
        </Animated.View>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [
                {
                  translateY
                }
              ]
            }
          ]}
        >
          {this.state.renderModalContents && this._renderModalContent()}
        </Animated.View>
      </View>
    );
  }

  _renderModalContent() {
    return <View />;
    // const { modalState } = this.props;
    // if (modalState.route.key && modalState.route.key === "bean") {
    //   return <EditBean beanId={modalState.route.beanId} />;
    // }

    // if (modalState.route.key && modalState.route.key === "view-roast") {
    //   return <ViewRoast roastId={modalState.route.roastId} />;
    // }

    // return <AddRoast />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  primaryContent: {
    flex: 1,
    backgroundColor: "white"
  }
});

function getState(state) {
  const { modalState } = state;
  return {
    modalState
  };
}

export default connect(getState)(ModalNavigator);
