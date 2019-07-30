import React from "react";
import StarRating from "react-native-star-rating";
import { config } from "../components";

const Stars = ({ panza, ...other }) => (
  <StarRating
    starColor={config.colors.green}
    emptyStarColor="white"
    maxStars={5}
    starSize={25}
    iconSet="Ionicons"
    emptyStar="ios-star-outline"
    fullStar="ios-star"
    {...other}
  />
);

export default Start;
