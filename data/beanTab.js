// @flow

const initialState = {
  activeTabIndex: 0
};

function beanTab(state = initialState, action) {
  if (action.type === "BEAN_TAB_CHANGE") {
    return { activeTabIndex: action.activeIndex };
  }

  return state;
}

export default beanTab;
