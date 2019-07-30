// @flow
import React from "react";
import _ from "lodash";
import TabView from "react-native-scrollable-tab-view";
import {
  View,
  Dimensions,
  StatusBar,
  Animated,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import fuzzy from "fuzzy";
import { Text, Base } from "../components";
import SearchField from "./SearchBar";
import EmptyHint from "./EmptyHint";
import Beans from "./Beans";
import AllRoasts from "./AllRoasts";
import { SafeAreaView } from "react-navigation";

class TabBar extends React.Component {
  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        key={name}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => this.props.goToPage(page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text bold small style={[{ color: textColor }, textStyle]}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const screen = Dimensions.get("window");
    const { scrollValue } = this.props;
    const containerWidth = screen.width;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: "absolute",
      width: containerWidth / numberOfTabs,
      height: 1,
      backgroundColor: "black",
      bottom: 0
    };

    const left = scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs]
    });

    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View
          style={[tabUnderlineStyle, { transform: [{ translateX: left }] }]}
        />
      </View>
    );
  }
}

class RoastList extends React.Component {
  constructor(props) {
    super(props);
    this._debouncedSearch = _.debounce(this._onSearch.bind(this), 200);
    this.state = {
      searchList: this._generateSearchText(props.roasts),
      search: "",
      results: props.roasts
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Your Roasts"
    };
  };

  _search(term) {
    this.refs.searchBar.unFocus();
  }

  _onSearch(term, force) {
    if (this.state.currentTab === 3) {
      return;
    }

    if (!force && !this.state.search) {
      return;
    }

    const results = fuzzy.filter(term, this.state.searchList);
    const matches = results.map(el => {
      return this.props.roasts[el.index];
    });

    this.setState({ results: matches });
  }

  componentWillReceiveProps(nextProps) {
    // eeeek, this is really bad. i need to rewrite this.
    this.setState(
      {
        searchList: this._generateSearchText(nextProps.roasts)
      },
      () => {
        if (!this.state.search) {
          this.setState({ results: nextProps.roasts });
        }

        this._onSearch(this.state.search, true);
      }
    );
  }

  _generateSearchText(coffees) {
    return coffees.map(coffee =>
      coffee._id ? coffee.name + coffee.beans.map(b => b.name).join(" ") : ""
    );
  }

  render() {
    const { roasts } = this.props;

    const renderHelp = roasts.length === 0;

    const { results } = this.state;

    return (
      <Base flex={1}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <SearchField
            ref="searchBar"
            searchBarStyle="minimal"
            value={this.state.search}
            placeholder="Search roasts"
            onChangeText={term => {
              if (!term) this._showAll();
              this.setState({ search: term });
              this._debouncedSearch(term);
            }}
            onSearchButtonPress={this._search.bind(this)}
            onCancelButtonPress={() => {}}
          />
          <TabView
            style={{ backgroundColor: "white" }}
            renderTabBar={() => <TabBar />}
            tabBarUnderlineColor="black"
            onChangeTab={i => {
              this.setState({ currentTab: i });
            }}
            tabBarActiveTextColor="black"
            tabBarUnderlineHeight={1}
            tabBarInactiveTextColor="#aaa"
          >
            <View style={{ flex: 1 }} tabLabel="All">
              <AllRoasts
                navigation={this.props.navigation}
                filter={allRoasts}
                roasts={results}
              />
            </View>
            <View style={{ flex: 1 }} tabLabel="Favorites">
              <AllRoasts
                navigation={this.props.navigation}
                filter={favouriteRoasts}
                roasts={results}
              />
            </View>
            <View style={{ flex: 1 }} tabLabel="Blends">
              <AllRoasts
                navigation={this.props.navigation}
                filter={blendsFilter}
                roasts={results}
              />
            </View>
            <View style={{ flex: 1 }} tabLabel="Beans">
              <Beans
                navigation={this.props.navigation}
                search={this.state.search}
                roasts={this.props.roasts}
              />
            </View>
          </TabView>
          {renderHelp && <EmptyHint />}
        </SafeAreaView>
      </Base>
    );
  }

  _showAll() {
    this.setState({ results: this.props.roasts });
  }
}

function allRoasts(roasts) {
  return roasts;
}

function favouriteRoasts(roasts) {
  return _.filter(roasts, "isFavourite");
}

function blendsFilter(roasts) {
  return _.filter(roasts, r => {
    return r.beans.length > 1;
  });
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",

    paddingBottom: 10,
    paddingTop: 10
  },
  tabs: {
    height: 44,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.15)",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: "white",
    borderBottomColor: "rgba(0,0,0,0.15)"
  }
});

function getState(state) {
  const { coffees } = state;

  // sort by date automatically

  return {
    isFetching: coffees.isFetching,
    roasts: _.orderBy(coffees.items, "date", "desc")
  };
}

export default connect(getState)(RoastList);
