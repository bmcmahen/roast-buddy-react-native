import React from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ActionSheetIOS,
  Platform,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  Modal
} from "react-native";
import shortid from "shortid";
import _ from "lodash";
import { hideRecorder } from "../actions/recorder";
import { Base, Text, Icon, Button, Divider, config } from "../components";
import Review from "./Review";
import moment from "moment";
import { connect } from "react-redux";
import FavouriteButton from "./FavouriteButton";
import RoastInfo from "./RoastInfo";
import StarRating from "react-native-star-rating";
import { toggleFavourite, addReview, removeCoffee } from "../actions/coffee";
import { SafeAreaView } from "react-navigation";

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
      title: "View Roast"
    };
  };

  shouldComponentUpdate(nextProps) {
    if (!nextProps.roast) {
      return false;
    }

    return true;
  }

  render() {
    const screen = Dimensions.get("window");
    const { roast } = this.props;
    const { reviews, isFavourite, beans } = roast;
    const isBlend = beans.length > 1;
    // const isMelange = roast.length > 1;
    const beanText = beans.map(b => b.name).join(", ");
    const name = isBlend ? roast.name : beanText;

    return (
      <Base flex={1} backgroundColor="white">
        <StatusBar hidden />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "transparent" }}
            behavior="padding"
          >
            <ScrollView
              stickyHeaderIndices={[0]}
              keyboardShouldPersistTaps="always"
            >
              <Base
                style={[
                  {
                    zIndex: 500,
                    backgroundColor: "#fafafa"
                  },
                  styles.tabs
                ]}
                row
                alignItems="center"
                justifyContent="center"
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  accessible
                  accessibilityLabel="Like"
                  accessibilityTraits="button"
                  onPress={this._toggleFavouriteStatus.bind(this)}
                >
                  <View style={[styles.tab, this.props.tabStyle]}>
                    <Base row>
                      <FavouriteButton
                        disabled
                        size={20}
                        color={isFavourite ? "red" : "#333"}
                        mr={1}
                        selected={isFavourite}
                      />
                      <Text bold small color={isFavourite ? "red" : "black"}>
                        {isFavourite ? "Liked" : "Like"}
                      </Text>
                    </Base>
                  </View>
                </TouchableOpacity>
                <Base
                  height={30}
                  width={StyleSheet.hairlineWidth}
                  backgroundColor="#bbb"
                />
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.setState({ modal: true });
                  }}
                  accessible
                  accessibilityLabel="Add Tasting Notes"
                  accessibilityTraits="button"
                >
                  <View style={[styles.tab, this.props.tabStyle]}>
                    <Base row alignItems="center">
                      <Icon name="plus" ml={0} size={30} mr={1} />
                      <Text bold small>
                        Tasting Notes
                      </Text>
                    </Base>
                  </View>
                </TouchableOpacity>
              </Base>

              {/* Roast description fields */}
              <Base
                backgroundColor="white"
                style={{
                  marginTop: 44,
                  paddingBottom: 40,
                  minHeight: screen.height - 200
                }}
              >
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
                  <Button
                    small
                    mt={2}
                    mr={2}
                    intent="primary"
                    variant="outline"
                    onPress={this._addReview.bind(this)}
                  >
                    Add Notes
                  </Button>
                </Base>
                <Divider />
              </Base>
            </ScrollView>
          </KeyboardAvoidingView>
          <Modal
            animationType="fade"
            visible={this.state.modal}
            onRequestClose={() => {
              this.setState({ modal: false });
            }}
          >
            <Base flex={1}>
              <Base flex={1}>
                <Review
                  onRequestSave={content => {
                    this._saveReview(content);
                  }}
                  onRequestClose={() => {
                    this.setState({ modal: false });
                  }}
                />
              </Base>
            </Base>
          </Modal>
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
    this.setState({ modal: true });
  }

  _saveReview(content) {
    const review = {
      _id: shortid.generate(),
      date: moment.utc().format(),
      value: content.notes,
      rating: content.rating
    };

    const reviews = [...this.props.roast.reviews, review];
    this.props.dispatch(addReview(this.props.roast._id, reviews));
    this.setState({ modal: false });
  }

  _toggleFavouriteStatus() {
    const isFav = this.props.roast.isFavourite;
    this.props.dispatch(toggleFavourite(this.props.roast._id, !isFav));
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",

    paddingBottom: 10,
    paddingTop: 10
  },
  tabs: {
    height: 44,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.15)",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: "#fafafa",
    borderBottomColor: "rgba(0,0,0,0.15)"
  }
});

function getState(state, other) {
  const roastId = other.navigation.getParam("id");

  return {
    roast: _.find(state.coffees.items, r => r._id === roastId)
  };
}

export default connect(getState)(ViewRoast);
