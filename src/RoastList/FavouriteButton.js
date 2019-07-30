import React from "react";
import { TouchableIcon, Icon } from "../components";
import { Ionicons } from "@expo/vector-icons";
import BaseIcon from "../components/Icons/BaseIcon";

/**
 * Toggle Favourite
 */

const FavouriteButton = ({ onChange, selected, ...other }) => (
  <TouchableIcon
    accessibilityLabel={
      selected ? "Remove from Favourites" : "Add to Favourites"
    }
    style={{ marginTop: 3 }}
    onPress={onChange}
  >
    {selected ? (
      <BaseIcon name="md-heart" Component={Ionicons} color="red" {...other} />
    ) : (
      <BaseIcon
        name="md-heart-empty"
        Component={Ionicons}
        color="#ddd"
        {...other}
      />
    )}
  </TouchableIcon>
);

export default FavouriteButton;
