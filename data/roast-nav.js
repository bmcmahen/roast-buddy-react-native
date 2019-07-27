// @flow

import React from "react";
import { StateUtils } from "react-navigation";

function createRoastNavState() {
  return {
    index: 0,
    routes: [{ key: "beans", title: "Select beans" }]
  };
}

/**
 * Add Roast Navigator
 */

export default function addRoastState(state = createRoastNavState(), action) {
  let { type } = action;

  switch (type) {
    case "ADD_ROAST_PUSH": {
      const s = StateUtils.push(state, action.route);
      if (s !== state) {
        return s;
      }
    }

    case "ADD_ROAST_POP": {
      const s = StateUtils.pop(state);
      if (s !== state) {
        return s;
      }
    }
  }

  return state;
}
