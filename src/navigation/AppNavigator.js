import React from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
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
import EditBean from "../BeanList/EditBean";

const TabNavigator = createBottomTabNavigator(
  {
    Activity: Home,
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

const RecorderNavigator = createStackNavigator({
  SelectBeans: { screen: SelectBeans },
  Blend: { screen: Blend },
  Recorder: { screen: RecordRoast }
});

const RootNavigator = createStackNavigator(
  {
    Root: TabNavigator,
    Recorder: RecorderNavigator,
    Bean: EditBean,
    ViewRoast: ViewRoast
  },
  {
    headerMode: "none",
    mode: "modal"
  }
);

export default createAppContainer(RootNavigator);
