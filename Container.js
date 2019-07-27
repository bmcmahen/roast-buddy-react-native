import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./data";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import { View, AsyncStorage } from "react-native";
import Debug from "react-native-debug";

import Boot from "./Boot";
import Intro from "./Onboard/Intro";

if (__DEV__) {
  console.log("enable");
  Debug.enable("*");
}

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

function warn(error) {
  console.warn(error.message || error);
  throw error;
}

const promiseMiddleware = store => next => action =>
  typeof action.then === "function"
    ? Promise.resolve(action).then(next, warn)
    : next(action);

/**
 * Main App container
 */

export default class Container extends React.Component {
  constructor() {
    super();

    const logger = createLogger({
      predicate: (getState, action) => isDebuggingInChrome,
      collapsed: true,
      duration: true
    });

    const createAppStore = applyMiddleware(thunk, promiseMiddleware, logger)(
      createStore
    );

    const store = autoRehydrate()(createAppStore)(reducers);

    persistStore(
      store,
      {
        storage: AsyncStorage,
        whitelist: [
          "roasts", // deprecated
          "customBeans",
          "coffees",
          "settings",
          "beans",
          "user"
        ]
      },
      () => {
        this.setState({ loading: false });
      }
    );

    if (isDebuggingInChrome) {
      window.store = store;
    }

    this.state = {
      loading: true,
      store
    };
  }

  render() {
    if (this.state.loading) {
      return <View />;
    }

    return (
      <Provider store={this.state.store}>
        <View style={{ flex: 1 }}>
          <Boot />
          <Intro />
        </View>
      </Provider>
    );
  }
}
