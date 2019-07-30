// @flow
import shortid from "shortid";
import _ from "lodash";
import moment from "moment";

function getDefaultState() {
  return {
    beans: [],
    _id: shortid.generate(),
    name: "",
    date: moment()
      .utc()
      .format(),
    reviews: [],
    roasts: [],
    isBlend: false,
    isFavourite: false,
    isMelange: false,
    isRecording: false
  };
}

export default function roast(state = getDefaultState(), action) {
  const { type } = action;

  switch (action.type) {
    case "ROAST_CHANGE_NAME": {
      return {
        ...state,
        name: action.name
      };
    }

    case "START_RECORDING": {
      return {
        ...state,
        isRecording: true
      };
    }

    case "STOP_RECORDING": {
      return {
        ...state,
        isRecording: false
      };
    }

    case "ROAST_CHANGE": {
      return {
        ...state,
        ...action.roast
      };
    }

    case "ROAST_CHANGE_BEANS": {
      return {
        ...state,
        beans: action.beans
      };
    }

    case "RESET_ROAST": {
      return getDefaultState();
    }

    case "QUEUE_ROAST_ADD": {
      return {
        ...state,
        roasts: [...state.roasts, action.roast]
      };
    }

    case "QUEUE_ROAST_EDIT": {
      return {
        ...state,
        roasts: state.roasts.map((roast, i) => {
          if (action.roastId === roast._id) {
            return { ...roast, ...action.roast };
          }
          return roast;
        })
      };
    }

    case "QUEUE_ROAST_DELETE": {
      const filtered = _.filter(state.roasts, roast => {
        if (roast._id !== action.roastId) return true;
        return false;
      });

      return {
        ...state,
        roasts: filtered
      };
    }

    case "ROAST_CHANGE_MELANGE": {
      return {
        ...state,
        isMelange: action.isMelange
      };
    }
  }

  return state;
}
