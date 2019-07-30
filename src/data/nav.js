// @flow

import React from "react";
import { StateUtils } from "react-navigation";

// Define the app navigation state

function createAppNavigationState() {
  return {
    tabs: {
      index: 0,
      routes: [
        { key: "learn" },
        { key: "beans" },
        { key: "record" },
        { key: "list" },
        { key: "profile" }
      ]
    },
    learn: {
      index: 0,
      routes: [{ key: "Learn Home", title: "Roast Buddy" }]
    },
    record: {
      index: 0,
      routes: [{ key: "Record Home", title: "Record" }]
    },
    list: {
      index: 0,
      routes: [{ key: "List Home" }]
    },
    profile: {
      index: 0,
      routes: [{ key: "Profile Home" }]
    },
    beans: {
      index: 0,
      routes: [{ key: "Bean Home", title: "Beans" }]
    }
  };
}

/**
 * Navigation state reducer
 */

export default function navState(state = createAppNavigationState(), action) {
  let { type } = action;
  if (type === "BackAction") {
    type = "POP";
  }

  switch (type) {
    case "PUSH": {
      const route = action.route;
      const { tabs } = state;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = state[tabKey];
      const nextScenes = StateUtils.push(scenes, route);
      if (scenes !== nextScenes) {
        return {
          ...state,
          [tabKey]: nextScenes
        };
      }
      break;
    }

    case "POP": {
      const { tabs } = state;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = state[tabKey];
      const nextScenes = StateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return {
          ...state,
          [tabKey]: nextScenes
        };
      }
      break;
    }

    case "SELECT_TAB": {
      const tabKey = action.tabKey;
      const tabs = StateUtils.jumpTo(state.tabs, tabKey);
      if (tabs !== state.tabs) {
        return {
          ...state,
          tabs
        };
      }
      break;
    }

    case "SELECT_TAB_AND_ROUTE": {
      const route = action.route;
      const tabKey = action.tabKey;
      const tabs = StateUtils.jumpTo(state.tabs, tabKey);
      const scenes = state[tabKey];
      const nextScenes = StateUtils.reset(scenes, [route]);
      // const nextScenes = StateUtils.jumpTo(scenes, route)
      if (tabs !== state.tabs || scenes !== nextScenes) {
        return {
          ...state,
          tabs,
          [tabKey]: nextScenes
        };
      }
    }
  }

  return state;
}
