import React from "react";
import _ from "lodash";
import TabView from "react-native-scrollable-tab-view";
import {
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { Text, Base, config } from "../components";
import AllBeanList from "./BeanList";
import CustomBeanList from "./CustomBeanList";
import { changeBeanTab } from "../actions/beanTabs";
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

class BeanList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
  }

  componentWillUnmount() {
    this.props.dispatch(changeBeanTab(0));
  }

  render() {
    return (
      <Base flex={1}>
        <SafeAreaView style={{ flex: 1 }}>
          <TabView
            style={{ backgroundColor: "white" }}
            renderTabBar={() => <TabBar />}
            tabBarUnderlineColor="black"
            onChangeTab={i => {
              this.setState({ currentTab: i });
              this.props.dispatch(changeBeanTab(i.i));
            }}
            tabBarActiveTextColor="black"
            tabBarUnderlineHeight={1}
            tabBarInactiveTextColor="#aaa"
          >
            <AllBeanList tabLabel="All" />
            <CustomBeanList tabLabel="Custom" />
          </TabView>
        </SafeAreaView>
      </Base>
    );
  }

  _search() {}

  _showAll() {}
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: config.colors.gray,

    paddingBottom: 10,
    paddingTop: 10
  },
  tabs: {
    height: 44,
    backgroundColor: "red",
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderTopWidth: 0,
    borderTopColor: "rgba(0,0,0,0.15)",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: config.colors.gray,
    borderBottomColor: "rgba(0,0,0,0.15)"
  }
});

export default connect()(BeanList);
