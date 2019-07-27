import React from "react";
import PropTypes from "prop-types";
import { View, TouchableHighlight, StyleSheet } from "react-native";
import _ from "lodash";
import { Text } from "../Text";
import Base from "../Base";
import { Icon } from "../Icons";

/**
 * A basic button that inherits from Base, and provides colourization
 * based upon background color configuration.
 */

const Button = ({
  variant = "default",
  intent = "default",
  size = "medium",
  block,
  children,
  iconColor,
  iconBefore,
  iconAfter,
  disabled,
  ...other
}) => {
  // determine our basic style props
  const props = {
    ...buttonSizes[size],
    ...buttonIntent[intent],
    ...buttonVariant[variant],
    ...other
  };

  let textColor = other.outline ? props.borderColor : props.textColor;

  // create our text component if necessary
  const child =
    children && typeof children === "string" ? (
      <Text
        color={textColor}
        large={other.large}
        medium={other.medium}
        small={other.small}
      >
        {children}
      </Text>
    ) : (
      children
    );

  console.log(textColor);

  // create icons if necessary
  const iconBeforeNode =
    iconBefore && typeof iconBefore === "string" ? (
      <Icon name={iconBefore} mr={1} size={25} color={iconColor || textColor} />
    ) : (
      iconBefore
    );

  const iconAfterNode =
    iconAfter && typeof iconAfter === "string" ? (
      <Icon name={iconAfter} ml={1} size={25} color={iconColor || textColor} />
    ) : (
      iconAfter
    );

  return (
    <Base
      Component={TouchableHighlight}
      accessibilityComponentType="button"
      disabled={disabled}
      baseStyle={[
        styles.button,
        block && styles.block,
        disabled && styles.disabled
      ]}
      {...props}
    >
      <View style={styles.buttonContent}>
        {iconBeforeNode}
        {child}
        {iconAfterNode}
      </View>
    </Base>
  );
};

Button.propTypes = {
  /** button size **/
  size: PropTypes.oneOf(["small", "medium", "large"]),

  /** button theme **/
  intent: PropTypes.oneOf([
    "primary",
    "secondary",
    "positive",
    "negative",
    "default"
  ]),

  /** variant */
  variant: PropTypes.oneOf(["outline", "ghost"]),

  children: PropTypes.node,

  /** disables the button, and reduces its opacity **/
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  underlayColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,

  /** stretch the button width **/
  block: PropTypes.bool,

  /** style text colour when using label prop **/
  textColor: PropTypes.string,

  /** optional icon **/
  iconAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconBefore: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

Button.displayName = "Button";

Button.defaultProps = {
  theme: "default",
  size: "medium",
  disabled: false,
  outline: false,
  block: false,
  rounded: 6
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 2
  },
  disabled: {
    opacity: 0.2
  },
  block: {
    alignSelf: "stretch"
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

/**
 * Prop styling options
 */

const buttonSizes = {
  large: { height: 55, px: 3 },
  small: { height: 30, px: 1 },
  medium: { height: 40, px: 2 }
};

const buttonIntent = {
  default: {
    backgroundColor: "midgray",
    textColor: "white",
    borderColor: "midgray",
    underlayColor: "darken"
  },
  primary: {
    backgroundColor: "primary",
    textColor: "white",
    borderColor: "primary",
    underlayColor: "darken"
  },
  secondary: {
    backgroundColor: "secondary",
    textColor: "white",
    borderColor: "secondary",
    underlayColor: "darken"
  },
  positive: {
    backgroundColor: "positive",
    textColor: "white",
    borderColor: "positive",
    underlayColor: "darken"
  },
  negative: {
    backgroundColor: "negative",
    textColor: "white",
    borderColor: "negative",
    underlayColor: "darken"
  }
};

const buttonVariant = {
  default: {},
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    underlayColor: "#eee",
    textColor: "default"
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    underlayColor: "transparent",
    textColor: "default"
  }
};

export default Button;
