// @flow

import React from "react";
import _ from "lodash";
import TabView from "react-native-scrollable-tab-view";
import { View, StatusBar, Platform } from "react-native";
import Home from "./Greeting";
import TutorialPane from "./TutorialPane1";
import TutorialPane2 from "./TutorialPane2";
import TutorialPane3 from "./TutorialPane3";
import TutorialPane5 from "./TutorialPane5";
import { connect } from "react-redux";
import { skipIntro } from "../actions/settings";

class TabBar extends React.Component {
  render() {
    return (
      <View
        style={{
          zIndex: 500,
          flexDirection: "row",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 30,
          justifyContent: "center"
        }}
      >
        {this.props.tabs.map((tab, i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderWidth: 1,
              borderColor: "white",
              backgroundColor:
                this.props.activeTab === i ? "white" : "transparent",
              borderRadius: 3,
              margin: 5
            }}
          />
        ))}
      </View>
    );
  }
}

class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 1
    };
  }

  skip = () => {
    // kinda lame, but whatevs
    this.props.dispatch(skipIntro());
    this.props.navigation.navigate("App");
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}

        <TabView
          ref="tabview"
          prerenderingSiblingsNumber={0}
          style={{ backgroundColor: "transparent" }}
          renderTabBar={() => <TabBar />}
          onChangeTab={i => {
            this.setState({ currentTab: i.i });
          }}
        >
          <View style={{ flex: 1 }} tabLabel="Home">
            <Home
              onRequestNext={() => {
                this.refs.tabview.goToPage(1);
              }}
              onFinish={this.skip}
            />
          </View>
          <View style={{ flex: 1 }} tabLabel="Tutorial">
            <TutorialPane
              isActive={this.state.currentTab === 1}
              onRequestNext={() => {
                this.refs.tabview.goToPage(2);
              }}
            />
          </View>
          <View style={{ flex: 1 }} tabLabel="Tutorial-2">
            <TutorialPane3
              isActive={this.state.currentTab === 2}
              onRequestNext={() => {
                this.refs.tabview.goToPage(3);
              }}
            />
          </View>
          <View style={{ flex: 1 }} tabLabel="Tutorial-3">
            <TutorialPane2
              isActive={this.state.currentTab === 3}
              onRequestNext={() => {
                this.refs.tabview.goToPage(4);
              }}
            />
          </View>

          <View style={{ flex: 1 }} tabLabel="Tutorial-5">
            <TutorialPane5
              isActive={this.state.currentTab === 5}
              onRequestNext={() => {
                this.skip();
              }}
            />
          </View>
        </TabView>
      </View>
    );
  }
}

function getState(state) {
  return {
    settings: state.settings
  };
}

export default connect(getState)(Greeting);
