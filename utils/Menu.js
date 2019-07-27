import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Modal,
  Animated,
  Platform,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";
import { Base, Text, config } from "../components";

const screen = Dimensions.get("window");

export default class Popup extends React.Component {
  static displayName = "Popup";

  constructor(props) {
    super(props);
    this.state = {
      animated: new Animated.Value(props.showing ? 0 : 1),
      contentHeight: screen.height
    };
    this.onLayout = this.onLayout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showing && !this.props.showing) {
      this.animateIn();
    } else if (!nextProps.showing && this.props.showing) {
      this.animateOut();
    }
  }

  onLayout(e) {
    console.log(e.nativeEvent.layout.height);
    this.setState({ contentHeight: e.nativeEvent.layout.height });
  }

  animateIn() {
    console.log("animate in");
    Animated.spring(this.state.animated, { toValue: 0 }).start();
  }

  animateOut() {
    console.log("animate out");
    Animated.spring(this.state.animated, { toValue: 1 }).start();
  }

  render() {
    const {
      options,
      autoDismiss,
      showing,
      customHeader,
      onRequestClose,
      showCancel
    } = this.props;

    const els = options.map((opt, i) => (
      <Option
        opt={opt}
        key={opt.key || i}
        onPress={() => {
          if (autoDismiss) {
            onRequestClose();
          }
        }}
      />
    ));

    if (showCancel) {
      els.push(
        <Option
          onPress={onRequestClose}
          opt={{
            label: "Cancel",
            condensed: false,
            primary: true,
            underlayColor: "#eee"
          }}
          key="cancel"
        />
      );
    }

    return (
      <Modal
        animationType="fade"
        transparent
        visible={showing}
        onRequestClose={onRequestClose}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View
            style={{
              height: screen.height,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center"
            }}
          >
            <Animated.View onLayout={this.onLayout}>
              <Base
                backgroundColor="white"
                rounded={Platform.select({ ios: 16, android: 0 })}
                m={2}
                style={{ overflow: "hidden" }}
              >
                {customHeader}
                <Base>{els}</Base>
              </Base>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const PopupMenuOption = ({ opt, inverted, panza, ...props }) => {
  if (React.isValidElement(opt)) {
    return opt;
  }

  const { onPress, label, primary, backgroundColor, condensed, ...other } = opt;

  return (
    <Base
      py={condensed ? 1 : 2}
      px={2}
      underlayColor="#eee"
      backgroundColor={backgroundColor}
      Component={TouchableHighlight}
      onPress={() => {
        props.onPress();
        if (onPress) onPress();
      }}
      style={{
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: inverted ? "rgba(255,255,255,0.2)" : config.borderColor
      }}
      {...other}
    >
      <View style={{ justifyContent: "center" }}>
        <Text
          bold={primary}
          small={condensed}
          color="black"
          numberOfLines={1}
          textAlign="center"
          inverted={inverted}
        >
          {label}
        </Text>
      </View>
    </Base>
  );
};

PopupMenuOption.propTypes = {
  inverted: PropTypes.bool,
  onPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  opt: PropTypes.shape({
    onPress: PropTypes.func,
    label: PropTypes.string.isRequired
  })
};

const Option = PopupMenuOption;
