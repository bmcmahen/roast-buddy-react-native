import React from "react";
import { TextBase } from "../Base";
import { Feather } from "@expo/vector-icons";

/**
 * Our base icon component that all other icons
 * compose. It uses ionicons, as provided by
 * react-native-vector-icons
 */

const BaseIcon = props => {
  const { name, ...other } = props;

  return <TextBase name={name} Component={Feather} {...other} />;
};

BaseIcon.displayName = "BaseIcon";

BaseIcon.defaultProps = {
  size: 20
};

export default BaseIcon;
