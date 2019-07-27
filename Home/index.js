import React from "react";
import shortid from "shortid";
import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
  View,
  Dimensions
} from "react-native";
import { showIntro } from "../actions/settings";
import Menu from "../utils/Menu";
import StarRating from "react-native-star-rating";
import { hideLoginHint } from "../actions/settings";
import _ from "lodash";
import { toggleFavourite, addReview } from "../actions/coffee";
import moment from "moment";
import {
  Base,
  Divider,
  TouchableIcon,
  MoreIcon,
  Icon,
  Button,
  Text
} from "../components";
import { DEGREES } from "../data";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RoastsByRegion from "./RoastsByContinent";
import RoastsByDegree from "./RoastsByDegree";
import { showRoast } from "../actions/recorder";
import FavouriteButton from "../RoastList/FavouriteButton";

// on first launch, fade in the title, and description, and start
// the tutorial automatically. have a button that says 'skip this tutorial'.
// once the tutorial is finished or skipped, show the 'login hint' arrow if
// the user is not logged in.
// show the user stats on the home page to make them more prominent -- alomst
// like a dashboard. Also show the user's last few roasts.

// remove the stats from the user profile page, and add only user
// account related stuff there -- so like sync status, etc.

const LoginHint = () => {
  const screen = Dimensions.get("window");

  return (
    <View style={[styles.hint, { width: screen.width }]}>
      <TouchableIcon
        accessibilityLabel="Close login hint"
        style={{ position: "absolute", top: 0, left: 0 }}
        onPress={() => {
          props.onDismiss();
        }}
      >
        <Icon name="x" size={20} m={2} />
      </TouchableIcon>
      <Text small style={styles.text}>
        <Text small>
          <Text small bold>
            Press the icon below
          </Text>{" "}
          to sign into Roast Buddy
        </Text>
      </Text>
      <Icon mt={1} size={25} mb={0} name="chevron-down" />
    </View>
  );
};

class PriorityRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      rating: null,
      text: ""
    };
  }

  _renderReview(review) {
    let text = "";
    let rating = "";

    if (typeof review.rating === "number") {
      rating = review.rating;
    }

    if (review.value) {
      text = review.value;
    }

    return (
      <Base
        ml={2}
        pr={2}
        style={{
          paddingVertical: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "rgba(0,0,0,0.15)"
        }}
        key={review._id}
      >
        <Text>
          {typeof rating == "number" && (
            <Text small light bold>
              {rating + "/5 - "}
            </Text>
          )}
          <Text small light>
            {moment(review.date).format("MMMM DD")} -{" "}
          </Text>
          <Text small light>
            {text}
          </Text>
        </Text>
      </Base>
    );
  }

  render() {
    const { roast, onPress } = this.props;
    const isBlend = roast.beans.length > 1;
    let name = isBlend ? roast.name : roast.beans[0].name;

    const date = moment(roast.date)
      .local()
      .fromNow();
    const deg =
      roast.roasts.length > 1
        ? "Melange"
        : DEGREES[roast.roasts[0].degree]
        ? DEGREES[roast.roasts[0].degree].label
        : "";

    return (
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(0,0,0,0.25)"
        }}
      >
        <TouchableHighlight underlayColor={"rgba(0,0,0,0.1)"} onPress={onPress}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              paddingVertical: 0,
              paddingLeft: 16
            }}
          >
            <Base flex={1} style={{ paddingVertical: 10 }}>
              <Text numberOfLines={1} small bold>
                {name}
              </Text>
              <Text numberOfLines={1} small style={{ lineHeight: 20 }} light>
                {date} {isBlend ? "- Blend" : ""} {deg ? "- " + deg : ""}
              </Text>
            </Base>
            <Base p={2} pl={0} align="center" row>
              <FavouriteButton
                size={25}
                selected={roast.isFavourite}
                onChange={() => {
                  this.props.dispatch(
                    toggleFavourite(roast._id, !roast.isFavourite)
                  );
                }}
              />
            </Base>
            <Icon
              name="ios-arrow-forward"
              alignSelf="center"
              size={15}
              color="light"
            />
          </View>
        </TouchableHighlight>
        {roast.reviews.map(this._renderReview.bind(this))}
        <Divider inset={16} />
        {this.state.expanded ? (
          <Base>
            <TextInput
              multiline
              underlineColorAndroid="transparent"
              autoFocus
              maxLength={300}
              value={this.state.text}
              style={{
                flex: 1,
                height: this.state.expanded ? 80 : 30,
                paddingHorizontal: 16,
                paddingVertical: 8,
                textAlignVertical: "top",
                fontSize: 16,
                lineHeight: 14
              }}
              placeholder={
                this.state.expanded ? "Type here" : "Add tasting notes >"
              }
              onChangeText={text => this.setState({ text })}
              onFocus={() => {
                // LayoutAnimation.spring()
                this.setState({ expanded: true });
              }}
              onBlur={() => {
                if (!this.state.text) {
                  // LayoutAnimation.spring()
                  // this.setState({ expanded: false })
                }
              }}
            />
            <Base p={2} row justify="space-between" alignItems="center">
              <StarRating
                rating={this.state.rating}
                maxStars={5}
                iconSet="Ionicons"
                emptyStar="ios-star-outline"
                starColor={"green"}
                emptyStarColor="#aaa"
                fullStar="ios-star"
                halfStar="ios-star-half"
                starSize={23}
                selectedStar={stars => {
                  this.setState({ rating: stars });
                }}
              />
              <Base row>
                <Button
                  small
                  mr={1}
                  onPress={() => {
                    LayoutAnimation.spring();
                    this.setState({ expanded: false, rating: null, text: "" });
                  }}
                  outline
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    const review = {
                      _id: shortid.generate(),
                      date: moment.utc().format(),
                      value: this.state.text,
                      rating: this.state.rating
                    };

                    const reviews = [...roast.reviews, review];
                    this.props.dispatch(addReview(roast._id, reviews));
                    this.setState({ expanded: false, rating: null, text: "" });
                  }}
                  disabled={!this.state.text}
                  small
                  primary
                >
                  Post Review
                </Button>
              </Base>
            </Base>
          </Base>
        ) : (
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
            onPress={() => {
              LayoutAnimation.spring();
              this.setState({ expanded: true });
            }}
          >
            <Text small color="blue">
              Add tasting notes >
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

let dismiss = false;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHint: !props.user.isLoggedIn && !dismiss,
      showMore: false,
      options: [
        {
          key: "help",
          label: "Show Help",
          onPress: () => props.dispatch(showIntro())
        }
      ]
    };
  }

  _showMore() {
    this.setState({ showMore: true });

    // ActionSheetIOS.showActionSheetWithOptions({
    //   options: ['Show Help', 'Cancel'],
    //   cancelButtonIndex: 1
    // },
    // (i) => {
    //   if (i === 1) return
    //   this.props.dispatch(showIntro())
    // })
  }

  _renderRoast(roast, i) {
    return (
      <PriorityRow
        key={roast._id}
        dispatch={this.props.dispatch}
        roast={roast}
        onPress={() => this.props.dispatch(showRoast(roast._id))}
      />
    );
  }

  render() {
    const { hasRoasts, recentRoasts } = this.props;

    const ScrollComponent =
      Platform.OS === "ios" ? KeyboardAwareScrollView : ScrollView;

    return (
      <Base
        flex={1}
        style={{
          ...Platform.select({
            ios: { paddingTop: 20 }
          })
        }}
        backgroundColor="#fafafa"
      >
        <StatusBar barStyle="dark-content" />
        <Menu
          showing={this.state.showMore}
          showCancel
          autoDismiss
          onRequestClose={() => this.setState({ showMore: false })}
          options={this.state.options}
        />

        <ScrollComponent
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={"on-drag"}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={{ paddingBottom: 0, paddingTop: 0 }}
          style={{ flex: 1, marginTop: 0 }}
        >
          <Base justify="space-between" align="center" pr={2} row>
            <Text giant thick m={2} mt={2}>
              Roast Buddy
            </Text>
            <TouchableIcon
              style={{
                paddingLeft: 16,
                ...Platform.select({
                  android: { paddingRight: 8 }
                })
              }}
              accessibilityLabel="More options"
              onPress={this._showMore.bind(this)}
            >
              <MoreIcon color="black" />
            </TouchableIcon>
          </Base>
          <Divider backgroundColor="rgba(0,0,0,0.25)" />
          {recentRoasts.length ? (
            <Base>
              <Text p={2} pb={1} mt={2} large bold>
                Recent roasts
              </Text>
              {recentRoasts.map((roast, i) => this._renderRoast(roast, i))}
            </Base>
          ) : (
            <View>
              <Base p={2}>
                <Text pb={1} mt={2} large bold>
                  Recent roasts
                </Text>
                <Text light small>
                  No roasts recorded.
                </Text>
              </Base>
              <Divider />
            </View>
          )}
          {hasRoasts && (
            <View>
              <Text p={2} pb={1} mt={2} large bold>
                Roast statistics
              </Text>
              <Divider backgroundColor="rgba(0,0,0,0.25)" />
              <Base backgroundColor="white">
                <Base p={1}>
                  <RoastsByDegree />
                </Base>
                <Divider backgroundColor="rgba(0,0,0,0.25)" mt={2} />
                <Base p={1}>
                  <RoastsByRegion />
                </Base>
              </Base>
              <Divider backgroundColor="rgba(0,0,0,0.25)" />
            </View>
          )}
          {!hasRoasts && (
            <View>
              <Base p={2}>
                <Text pb={1} mt={2} large bold>
                  Roast statistics
                </Text>
                <Text light small>
                  No roasts recorded.
                </Text>
              </Base>
            </View>
          )}
        </ScrollComponent>
        {!this.props.settings.hideLoginHint && !this.props.user.isLoggedIn && (
          <LoginHint
            onDismiss={() => {
              this.props.dispatch(hideLoginHint());
            }}
          />
        )}
      </Base>
    );
  }
}

function getState(state) {
  const { coffees } = state;
  const sorted = _.orderBy(coffees.items, "date", "desc").slice(0, 3);
  const recentRoasts = sorted;

  return {
    user: state.user,
    hasRoasts: state.coffees.items.length > 0,
    recentRoasts,
    settings: state.settings
  };
}

const styles = StyleSheet.create({
  hint: {
    height: 100,
    position: "absolute",
    paddingRight: 25,
    alignItems: "flex-end",
    justifyContent: "center",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(230,230,230,0.97)"
  },
  text: {
    width: 200,
    marginTop: 10,
    textAlign: "right"
  }
});

export default connect(getState)(Home);
