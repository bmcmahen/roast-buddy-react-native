// @flow
import React from "react";

const initialState = {
  open: false,
  route: {}
};

/**
 * Modal state reducer
 */

export default function modalState(state = initialState, action) {
  let { type } = action;

  switch (type) {
    case "HIDE_RECORD": {
      return { open: false, route: {} };
    }

    case "SHOW_RECORD": {
      return { open: true, route: {} };
    }

    case "SHOW_EDIT_BEAN": {
      return { open: true, route: { key: "bean", beanId: action.beanId } };
    }

    case "SHOW_NEW_BEAN": {
      return { open: true, route: { key: "bean" } };
    }

    case "SHOW_ROAST": {
      return {
        open: true,
        route: { key: "view-roast", roastId: action.roastId }
      };
    }
  }

  return state;
}
