import React from "react";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Icon, NavTitle, NavTouchableText } from "panza";

// ROAST LISTING
// import ViewRoast from "./RoastList/ViewRoast";
// import RoastList from "./RoastList";
// import BeanSublist from "./RoastList/BeanSublist";

// LEARN
// import LearnHome from "./Learn";
// import Story from "./Learn/Story";

// PROFILE
// import Profile from "./Profile";

// BEAN LIST
// import BeanList from "./BeanList";
// import ViewBean from "./BeanList/ViewBean";
import { CardStack, Header } from "react-navigation";

/**
 * NAVIGATOR
 */

class AppNavigator extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._renderScene = this._renderScene.bind(this);
    this._back = this._back.bind(this);
    this._renderOverlay = this._renderOverlay.bind(this);
  }

  _renderScene(sceneProps) {
    const { navState, dispatch } = this.props;
    const { tabs } = navState;
    const tabKey = tabs.routes[tabs.index].key;

    return (
      <NavScene
        tabKey={tabKey}
        dispatch={this.props.dispatch}
        {...sceneProps}
      />
    );
  }

  _back() {
    this.props.dispatch({
      type: "POP"
    });
  }

  _renderOverlay(sceneProps) {
    const { navState } = this.props;
    const { tabs } = navState;
    const tabKey = tabs.routes[tabs.index].key;

    if (tabKey === "list" || tabKey === "profile" || tabKey === "learn") {
      return <View />;
    }

    return (
      <NavHeader
        style={{ backgroundColor: "#e4e3eb" }}
        {...sceneProps}
        dispatch={this.props.dispatch}
      />
    );
  }

  render() {
    const { navState, dispatch } = this.props;
    const { tabs } = navState;
    const tabKey = tabs.routes[tabs.index].key;
    const scenes = navState[tabKey];

    return (
      <View style={styles.navigator}>
        <CardStack
          key={"stack_" + tabKey}
          onNavigateBack={this._back}
          navigationState={scenes}
          renderHeader={this._renderOverlay}
          renderScene={this._renderScene}
          style={styles.navigatorCardStack}
        />
        <Tabs dispatch={dispatch} navState={tabs} />
      </View>
    );
  }
}

/**
 * RENDER NAV SCENE
 */

class NavScene extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { scene } = this.props;
    const route = scene.route.key;

    const sharedProps = {
      dispatch: this.props.dispatch
    };

    return <View />;

    // switch (route) {
    //   // List Views
    //   case "List Home":
    //     return <RoastList />;
    //   case "List View Roast":
    //     return <ViewRoast roastId={scene.route.roastId} />;
    //   case "List Bean Roasts":
    //     return <BeanSublist beanName={scene.route.beanName} />;

    //   // Home Views
    //   case "Learn Home":
    //     return <LearnHome />;
    //   case "Learn Story":
    //     return <Story storyId={scene.route.storyId} />;

    //   // Profile Views
    //   case "Profile Home":
    //     return <Profile />;

    //   // Bean Explorer
    //   case "Bean Home":
    //     return <BeanList />;
    //   case "Bean View":
    //     return (
    //       <ViewBean
    //         isCustom={scene.route.isCustom}
    //         beanId={scene.route.beanId}
    //       />
    //     );
    // }

    throw new Error("Route not found");
  }
}

/**
 * NAV HEADER
 */

class NavHeader extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._back = this._back.bind(this);
  }

  _back() {
    this.props.dispatch({ type: "POP" });
  }

  render() {
    return (
      <Header
        {...this.props}
        style={{
          elevation: 0,
          backgroundColor: "#e4e3eb",
          borderBottomColor: "rgba(0,0,0,0.25)",
          borderBottomWidth: StyleSheet.hairlineWidth
        }}
        onNavigateBack={this._back}
        renderTitleComponent={props => {
          const { title } = props.scene.route;
          if (title) {
            return (
              <NavTitle
                style={{
                  ...Platform.select({
                    ios: { textAlign: "center" }
                  })
                }}
              >
                {title}
              </NavTitle>
            );
          }
        }}
        renderRightComponent={props => {
          const { scene } = props;
          const { index, route } = scene;
          if (route.key === "Learn Home") {
            return <NavTouchableText onPress={() => {}}>Help</NavTouchableText>;
          }
        }}
      />
    );
  }
}

/**
 * TABS
 */

class Tabs extends React.Component {
  render() {
    const { navState, dispatch } = this.props;

    return (
      <View style={styles.tabs}>
        {navState.routes.map((route, i) => (
          <Tab
            key={route.key}
            route={route}
            dispatch={dispatch}
            selected={navState.index === i}
          />
        ))}
      </View>
    );
  }
}

/**
 * TAB
 */

class Tab extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._onPress = this._onPress.bind(this);
    this._icons = {
      learn: {
        active: "ios-home",
        inactive: "ios-home-outline"
      },
      beans: {
        active: "ios-list-box",
        inactive: "ios-list-box-outline",
        size: 30
      },
      list: {
        active: "ios-archive",
        inactive: "ios-archive-outline",
        size: 40
      },
      record: {
        active: "ios-add",
        inactive: "ios-add",
        size: 40
      },
      profile: {
        active: "ios-person",
        inactive: "ios-person-outline",
        size: 35
      }
    };
  }

  _onPress() {
    if (this.props.route.key === "record") {
      this.props.dispatch({
        type: "SHOW_RECORD",
        route: { key: "record", title: "Add Roast" }
      });

      return;
    }

    this.props.dispatch({
      type: "SELECT_TAB",
      tabKey: this.props.route.key
    });
  }

  render() {
    const style = [styles.tabText];
    if (this.props.selected) {
      style.push(styles.tabSelected);
    }

    const iconName = this.props.selected
      ? this._icons[this.props.route.key].active
      : this._icons[this.props.route.key].inactive;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.tab}
        onPress={this._onPress}
      >
        <Icon
          size={this._icons[this.props.route.key].size || 30}
          name={iconName}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor: "white"
  },
  navigatorCardStack: {
    flex: 20
  },
  tabs: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,.15)",
    height: 45
  },
  tab: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center"
  },
  tabText: {
    color: "#222",
    fontWeight: "500"
  },
  tabSelected: {
    color: "blue"
  }
});

function getState(state) {
  const { roasts, settings, navState } = state;
  return {
    roasts,
    settings,
    navState
  };
}

export default connect(getState)(AppNavigator);
