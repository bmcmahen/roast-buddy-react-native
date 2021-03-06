import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  LayoutAnimation,
  View,
  Dimensions
} from "react-native";
import Menu from "../utils/Menu";
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
  Text,
  NavTouchableIcon,
  config,
  SectionHeader
} from "../components";
import { DEGREES } from "../data";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RoastsByRegion from "./RoastsByContinent";
import RoastsByDegree from "./RoastsByDegree";
import FavouriteButton from "../RoastList/FavouriteButton";
import { SafeAreaView } from "react-navigation";
import { ReviewInput } from "../RoastList/ReviewInput";

// on first launch, fade in the title, and description, and start
// the tutorial automatically. have a button that says 'skip this tutorial'.
// once the tutorial is finished or skipped, show the 'login hint' arrow if
// the user is not logged in.
// show the user stats on the home page to make them more prominent -- alomst
// like a dashboard. Also show the user's last few roasts.

// remove the stats from the user profile page, and add only user
// account related stuff there -- so like sync status, etc.

const LoginHint = props => {
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
          borderTopColor: config.borderColor
        }}
        key={review._id}
      >
        <Text>
          {typeof rating == "number" && (
            <Text small light bold>
              {rating + "/5 - "}
            </Text>
          )}
          <Text style={{ lineHeight: 20 }} small light>
            {moment(review.date).format("MMMM DD")} -{" "}
          </Text>
          <Text style={{ lineHeight: 20 }} small light>
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
              <Text numberOfLines={1} style={{ lineHeight: 20 }} small bold>
                {name}
              </Text>
              <Text numberOfLines={1} small style={{ lineHeight: 20 }} light>
                {date} {isBlend ? "- Blend" : ""} {deg ? "- " + deg : ""}
              </Text>
            </Base>
            <Base align="center" row>
              <FavouriteButton
                size={25}
                selected={roast.isFavourite}
                onChange={() => {
                  this.props.dispatch(
                    toggleFavourite(roast._id, !roast.isFavourite)
                  );
                }}
              />
              <Icon ml={2} name="chevron-right" size={25} color="light" />
            </Base>
          </View>
        </TouchableHighlight>
        {roast.reviews.map(this._renderReview.bind(this))}
        <Divider inset={16} />
        {this.state.expanded ? (
          <ReviewInput
            onRequestCancel={() => this.setState({ expanded: false })}
            onRequestAdd={review => {
              const reviews = [...roast.reviews, review];
              this.props.dispatch(addReview(roast._id, reviews));
              this.setState({ expanded: false });
            }}
          />
        ) : (
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
            onPress={() => {
              LayoutAnimation.spring();
              this.setState({ expanded: true });
            }}
          >
            <Text small color="blue">
              Add notes
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
          onPress: () => props.navigation.navigate("Onboard")
        }
      ]
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Recent Activity",
      headerStyle: {
        backgroundColor: "#f8f8f8"
      },
      headerRight: (
        <NavTouchableIcon
          style={{
            paddingLeft: 16,
            ...Platform.select({
              android: { paddingRight: 8 }
            })
          }}
          accessibilityLabel="More options"
          onPress={() => {
            navigation.getParam("showMore")();
          }}
        >
          <MoreIcon color="black" />
        </NavTouchableIcon>
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ showMore: this._showMore.bind(this) });
  }

  _showMore() {
    this.setState({ showMore: true });
  }

  _renderRoast(roast, i) {
    const { beans } = roast;
    const isBlend = beans.length > 1;
    const beanText = beans.map(b => b.name).join(", ");
    const name = isBlend ? roast.name : beanText;

    return (
      <PriorityRow
        key={roast._id}
        dispatch={this.props.dispatch}
        roast={roast}
        onPress={() => {
          this.props.navigation.navigate("ViewRoast", {
            id: roast._id,
            title: name
          });
        }}
      />
    );
  }

  render() {
    const { hasRoasts, recentRoasts } = this.props;

    const ScrollComponent =
      Platform.OS === "ios" ? KeyboardAwareScrollView : ScrollView;

    return (
      <Base flex={1} backgroundColor={config.colors.gray}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
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
            {recentRoasts.length ? (
              <Base>
                <SectionHeader mt={2}>Recent Roasts</SectionHeader>
                {recentRoasts.map((roast, i) => this._renderRoast(roast, i))}
              </Base>
            ) : (
              <Base p={2}>
                <Text style={{ textAlign: "center" }} small bold lineHeight={3}>
                  You haven't recorded any roasts yet.
                </Text>
                <Text
                  style={{ textAlign: "center" }}
                  small
                  light
                  lineHeight={3}
                >
                  Once you start recording roasts, your recent activity and
                  roast statistics will appear here.
                </Text>
              </Base>
            )}
            {hasRoasts && (
              <View>
                <SectionHeader mt={1}>Roast Statistics</SectionHeader>
                <Divider backgroundColor={config.borderColor} />
                <Base backgroundColor="white">
                  <Base p={1}>
                    <RoastsByDegree />
                  </Base>
                  <Divider backgroundColor={config.borderColor} mt={2} />
                  <Base p={1}>
                    <RoastsByRegion />
                  </Base>
                </Base>
                <Divider backgroundColor={config.borderColor} />
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
        </SafeAreaView>
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
