import React from "react";
import Icon from "./BaseIcon";
import { Platform } from "react-native";

export const ArrowRightIcon = props => {
  return <Icon color="midgray" name="chevron-right" size={25} {...props} />;
};

export const PlusIcon = props => {
  return (
    <Icon
      name={Platform.select({
        ios: "ios-add-outline",
        android: "md-add",
        web: "ios-add-outline"
      })}
      {...props}
    />
  );
};

// on android we use 'back', on ios we use 'close'
export const CloseIcon = props => {
  return (
    <Icon
      name={Platform.select({
        ios: "close",
        android: "md-arrow-back",
        web: "close"
      })}
      {...props}
    />
  );
};

export const BackIcon = props => {
  return (
    <Icon
      name={Platform.select({
        ios: "ios-arrow-back",
        android: "md-arrow-back",
        web: "ios-arrow-back"
      })}
      size={30}
      {...props}
    />
  );
};

export const SearchIcon = props => (
  <Icon
    name={Platform.select({
      ios: "ios-search",
      android: "md-search",
      web: "ios-search"
    })}
    size={25}
    {...props}
  />
);

export const MoreIcon = props => <Icon name={"more-vertical"} />;
