import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Text, Base, Icon } from "../components";
import moment from "moment";
import { DEGREES } from "../data";
import FavouriteButton from "./FavouriteButton";
import { toggleFavourite } from "../actions/coffee";
import { connect } from "react-redux";

const RoastRow = ({ dispatch, roast, onPress, children }) => {
  const isBlend = roast.beans.length > 1;
  let name = isBlend ? roast.name : roast.beans[0].name;

  const date = moment(roast.date)
    .local()
    .format("MMM DD, YYYY");
  const deg =
    roast.roasts.length > 1
      ? "Melange"
      : DEGREES[roast.roasts[0].degree]
      ? DEGREES[roast.roasts[0].degree].label
      : "";

  return (
    <TouchableHighlight underlayColor={"rgba(0,0,0,0.1)"} onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingVertical: 0,
          paddingLeft: 16
        }}
      >
        {/* <View style={{ alignSelf: 'center', marginRight: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: color }} /> */}
        <Base flex={1} style={{ paddingVertical: 10 }}>
          <Text numberOfLines={1} small bold>
            {name}
          </Text>
          <Text numberOfLines={1} small light>
            {date} {isBlend ? "- Blend" : ""} {deg ? "- " + deg : ""}
          </Text>
          {children}
        </Base>
        <Base row align="center">
          <FavouriteButton
            size={25}
            selected={roast.isFavourite}
            onChange={() => {
              dispatch(toggleFavourite(roast._id, !roast.isFavourite));
            }}
          />

          <Icon name="chevron-right" ml={2} size={25} color="light" />
        </Base>
      </View>
    </TouchableHighlight>
  );
};

export default connect()(RoastRow);
