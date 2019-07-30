//@flow
import React from "react";
import { Base } from "../components";
import { StatusBar } from "react-native";
import TabView from "./TabView";

class BeanList extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "Coffee Beans"
  };

  render() {
    return (
      <Base backgroundColor="gray" flex={1}>
        <StatusBar barStyle="dark-content" />
        <TabView navigation={this.props.navigation} />
      </Base>
    );
  }
}

export default BeanList;
