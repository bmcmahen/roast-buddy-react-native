export const showRecorder = {
  type: "SHOW_RECORD"
};

export const hideRecorder = {
  type: "HIDE_RECORD"
};

export function showEditBean(beanId) {
  return {
    type: "SHOW_EDIT_BEAN",
    beanId
  };
}

export function showNewBean() {
  return {
    type: "SHOW_NEW_BEAN"
  };
}

export function showRoast(roastId) {
  return {
    type: "SHOW_ROAST",
    roastId
  };
}
