// @flow
import _ from "lodash";
import { combineReducers } from "redux";
import navState from "./nav";
import modalState from "./modal";
import roastNavState from "./roast-nav";
import roastState from "./roast";
import customBeans from "./custom-beans";
import userState from "./user";
import beansState from "./beans";
import coffees from "./coffees";
import beanTab from "./beanTab";

/**
 * Basic user settings
 */

const initialSettings = {
  skipIntro: false,
  hideLoginHint: false
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case "SKIP_INTRO":
      return {
        ...state,
        skipIntro: true
      };
    case "SHOW_INTRO":
      return {
        ...state,
        skipIntro: false
      };
    case "HIDE_LOGIN_HINT":
      return {
        ...state,
        hideLoginHint: true
      };
  }

  return state;
};

// deprecated
function roasts(state = [], action) {
  switch (action.type) {
    case "REMOVE_DEPRECATED_ROASTS":
      return [];
  }

  return state;
}

export default combineReducers({
  roasts,
  coffees,
  settings,
  navState,
  modalState,
  roastNavState,
  roast: roastState,
  customBeans,
  beans: beansState,
  user: userState,
  beanTab
});

// global config -- not user customizable, yet, although
// we should perhaps let people add their own roast profiles,
// which would be saved by redux

export const DEGREES = [
  {
    label: "First Crack",
    color: "#866949",
    description: "The first cracks have begun."
  },
  {
    label: "City",
    color: "#7c5b3a",
    description: "First crack has finished."
  },
  {
    label: "City+",
    description: "The coffee has cleared first crack.",
    color: "#5c442a"
  },
  {
    label: "Full City",
    description: "The coffee is on the verge of second crack.",
    color: "#4e3519"
  },
  {
    label: "Full City+",
    description:
      "The darker side of Full City, where the coffee has just entered 2nd crack.",
    color: "#392004"
  },
  {
    label: "Vienna - Light French",
    description:
      "A darker roast where roast character begins to eclipse origin character.",
    color: "#1f1307"
  },
  {
    label: "French",
    description: "A very dark roast.",
    color: "#050500"
  },
  {
    label: "Italian or Spanish",
    description: "A very, very dark roast.",
    color: "#000000"
  }
];
