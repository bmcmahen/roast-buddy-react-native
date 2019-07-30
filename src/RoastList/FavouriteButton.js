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
      <Icon name="heart" color="red" {...other} />
    ) : (
      <Icon name="heart" color="#ddd" {...other} />
    )}
  </TouchableIcon>
);

export default FavouriteButton;
