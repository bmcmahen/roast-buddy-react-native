import _ from "lodash";

const bean = (state, action) => {
  switch (action.type) {
    case "ADD_CUSTOM_BEAN":
      return { ...action.bean };

    case "EDIT_CUSTOM_BEAN":
      if (action.beanId === state._id) {
        return {
          ...state,
          ...action.bean
        };
      }
  }

  return state;
};

const beans = (state = [], action) => {
  switch (action.type) {
    case "ADD_CUSTOM_BEAN":
      return [...state, bean(null, action)];
    case "EDIT_CUSTOM_BEAN":
      return state.map(b => bean(b, action));
    case "DELETE_CUSTOM_BEAN":
      return _.filter(state, b => b._id !== action.beanId);
  }

  return state;
};

export default beans;
