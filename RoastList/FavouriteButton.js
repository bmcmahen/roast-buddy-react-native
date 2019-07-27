import React from "react";
import { TouchableIcon, Icon } from "../components";

/**
 * Toggle Favourite
 */

const FavouriteButton = ({ onChange, selected, ...other }) => (
  <TouchableIcon
    accessibilityLabel={
      selected ? "Remove from Favourites" : "Add to Favourites"
    }
    onPress={onChange}
  >
    {selected ? (
      <Icon name="ios-heart" color="red" {...other} />
    ) : (
      <Icon name="ios-heart-outline" color="#ddd" {...other} />
    )}
  </TouchableIcon>
);

export default FavouriteButton;
