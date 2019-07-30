import React from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";
import { View } from "react-native";
import BeanList from "../BeanList";
import RoastList from "../RoastList";
import Profile from "../Profile";
import Home from "../Home";
import { Icon, config } from "../components";
import SelectBeans from "../RecordRoast/SelectBeans";
import Blend from "../RecordRoast/Blend";
import RecordRoast from "../RecordRoast";
import ViewRoast from "../RoastList/ViewRoast";
import { connect } from "react-redux";
import EditBean from "../BeanList/EditBean";
import Onboard from "../Onboard";

const ActivityNavigator = createStackNavigator(
  {
    ActivityRoot: Home,
    ViewRoast
  },
  {
    initialRouteName: "ActivityRoot"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Activity: ActivityNavigator,
    Roasts: RoastList,
    Record: View,
    Beans: BeanList,
    Profile
  },
  {
    tabBarOptions: {
      activeTintColor: config.colors.primary
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        switch (routeName) {
          case "Activity":
            return <Icon name="home" color={tintColor} />;
          case "Roasts":
            return <Icon name="book" color={tintColor} />;
          case "Record":
            return <Icon name="plus-square" color={tintColor} />;
          case "Beans":
            return <Icon name="list" color={tintColor} />;
          case "Profile":
            return <Icon name="user" color={tintColor} />;
        }
      },
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (navigation.state.key === "Record") {
          navigation.navigate("Recorder");
        } else {
          defaultHandler();
        }
      }
    })
  }
);

/**
 * Handles tab views
 */

const RecorderNavigator = createStackNavigator({
  SelectBeans: { screen: SelectBeans },
  Blend: { screen: Blend },
  Recorder: { screen: RecordRoast }
});

/**
 * Handles modal views
 */

const RootNavigator = createStackNavigator(
  {
    Root: TabNavigator,
    Recorder: RecorderNavigator,
    Bean: EditBean
  },
  {
    headerMode: "none",
    mode: "modal"
  }
);

/**
 * Determine whether we should show the onboard
 */

class LoadingManager extends React.Component {
  constructor(props) {
    super(props);
    props.navigation.navigate(props.settings.skipIntro ? "App" : "Onboard");
  }

  render() {
    return null;
  }
}

const Loading = connect(state => {
  return {
    settings: state.settings
  };
})(LoadingManager);

const OnboardNavigator = createSwitchNavigator(
  {
    Loading,
    App: RootNavigator,
    Onboard: Onboard
  },
  {
    initialRouteName: "Loading"
  }
);

export default createAppContainer(OnboardNavigator);
