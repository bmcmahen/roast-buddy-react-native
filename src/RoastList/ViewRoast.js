import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  ActionSheetIOS,
  Platform,
  Dimensions,
  LayoutAnimation,
  Animated,
  Alert
} from "react-native";
import _ from "lodash";
import { hideRecorder } from "../actions/recorder";
import { Base, Text, Button, Divider, config } from "../components";
import moment from "moment";
import { connect } from "react-redux";
import RoastInfo from "./RoastInfo";
import StarRating from "react-native-star-rating";
import { toggleFavourite, addReview, removeCoffee } from "../actions/coffee";
import { SafeAreaView } from "react-navigation";
import { ReviewInput } from "./ReviewInput";

const ViewReviewComponent = ({ review, roastDate, panza }) => {
  const diff = moment.utc(roastDate).diff(moment.utc(review.date), "days");
  const diffText = "+" + Math.abs(diff) + " days";

  return (
    <Base mt={2}>
      <Base pr={2}>
        {typeof review.rating === "number" && (
          <Base width={125} mb={review.value ? 2 : 0}>
            <StarRating
              rating={review.rating}
              maxStars={5}
              iconSet="Ionicons"
              emptyStar="ios-star-outline"
              starColor={config.colors.green}
              emptyStarColor="#aaa"
              fullStar="ios-star"
              halfStar="ios-star-half"
              starSize={25}
              disabled={true}
              selectedStar={() => {}}
            />
          </Base>
        )}
        <Text small>{review.value}</Text>
        <Base row alignItems="center">
          <Text mt={review.value ? 2 : 0} small light>
            {diffText}
          </Text>
        </Base>
      </Base>
      <Divider mt={2} />
    </Base>
  );
};

const ViewReview = ViewReviewComponent;

class ViewRoast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      scrollY: new Animated.Value(0)
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.roast) {
      return false;
    }

    return true;
  }

  componentDidMount() {}

  render() {
    const screen = Dimensions.get("window");
    const { roast } = this.props;
    const { reviews, isFavourite } = roast;

    return (
      <Base flex={1} backgroundColor="white">
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "transparent" }}
            behavior="padding"
          >
            <ScrollView
              stickyHeaderIndices={[0]}
              keyboardShouldPersistTaps="always"
            >
              {/* Roast description fields */}
              <Base backgroundColor="white" style={{}}>
                <RoastInfo roast={roast} />

                <Base p={2} pr={0}>
                  <Base pr={2}>
                    <Text mb={1} small bold>
                      Tasting Notes
                    </Text>
                  </Base>
                  {reviews.map((review, i) => (
                    <ViewReview
                      key={review._id}
                      roastDate={this.props.roast.date}
                      review={review}
                    />
                  ))}
                </Base>
                {this.state.modal ? (
                  <ReviewInput
                    onRequestAdd={content => {
                      this._saveReview(content);
                    }}
                    onRequestCancel={() => {
                      this.setState({ modal: false });
                    }}
                  />
                ) : (
                  <Base px={2} pb={2}>
                    <Button
                      intent="primary"
                      onPress={this._addReview.bind(this)}
                    >
                      Add Notes
                    </Button>
                  </Base>
                )}
                <Divider />
              </Base>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Base>
    );
  }

  _showMore() {
    // todo: use multiplatform menu
    if (Platform.OS === "android") {
      Alert.alert("Delete this roast?", "This action cannot be undone", [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: () => {
            this.props.dispatch(
              removeCoffee(this.props.roast._id, this.props.roast)
            );

            this.props.dispatch(hideRecorder);
          }
        }
      ]);

      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Delete", "Cancel"],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0
      },
      i => {
        if (i === 1) return;
        if (i === 0) {
          this.props.dispatch(
            removeCoffee(this.props.roast._id, this.props.roast)
          );

          this.props.dispatch(hideRecorder);
        }
      }
    );
  }

  _addReview() {
    LayoutAnimation.spring();
    this.setState({ modal: true });
  }

  _saveReview(review) {
    const reviews = [...this.props.roast.reviews, review];
    this.props.dispatch(addReview(this.props.roast._id, reviews));
    this.setState({ modal: false });
  }

  _toggleFavouriteStatus() {
    const isFav = this.props.roast.isFavourite;
    this.props.dispatch(toggleFavourite(this.props.roast._id, !isFav));
  }
}

function getState(state, other) {
  const roastId = other.navigation.getParam("id");

  return {
    roast: _.find(state.coffees.items, r => r._id === roastId)
  };
}

export default connect(getState)(ViewRoast);
