import React from "react";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";
import StarRating from "react-native-star-rating";
import {
  Base,
  TouchableIcon,
  Icon,
  Divider,
  Button,
  Text,
  config
} from "../components";

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      review: "",
      rating: null
    };
  }

  render() {
    const disabled =
      !this.state.review && typeof this.state.rating !== "number";

    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "android" ? 150 : 0}
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.select({
          ios: "height",
          android: "height"
        })}
      >
        <Base
          p={2}
          pb={0}
          row
          alignItems="center"
          justifyContent="space-between"
        >
          <Text large bold>
            Tasting Notes
          </Text>
          <TouchableIcon
            accessibilityLabel="close"
            onPress={() => {
              this.props.onRequestClose();
            }}
          >
            <Icon name="x" size={40} />
          </TouchableIcon>
        </Base>
        <TextInput
          multiline
          autoFocus
          underlineColorAndroid="transparent"
          maxLength={500}
          defaultValue={this.state.review}
          placeholder="Write here..."
          style={{
            justifyContent: "flex-start",
            paddingHorizontal: 16,
            flex: 1,
            fontSize: 19,
            fontWeight: "300",
            textAlignVertical: "top",
            color: "#333"
          }}
          value={this.state.review}
          onChangeText={t => {
            this.setState({ review: t });
          }}
        />
        <Divider />
        <Base row py={1} alignItems="center" px={2}>
          <Base flex={1} pr={2}>
            <Base width={175}>
              <StarRating
                rating={this.state.rating}
                maxStars={5}
                iconSet="Ionicons"
                emptyStar="ios-star-outline"
                starColor={config.colors.green}
                emptyStarColor="#aaa"
                fullStar="ios-star"
                halfStar="ios-star-half"
                starSize={30}
                selectedStar={stars => {
                  this.setState({ rating: stars });
                }}
              />
            </Base>
          </Base>
          <Button
            disabled={disabled}
            onPress={() => {
              this.props.onRequestSave({
                notes: this.state.review,
                rating: this.state.rating
              });
            }}
            alignSelf="flex-end"
            primary
            outline
          >
            Save
          </Button>
        </Base>
      </KeyboardAvoidingView>
    );
  }
}

export default Review;
