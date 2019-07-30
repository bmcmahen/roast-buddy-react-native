export function addCustomBean(bean) {
  return dispatch => {
    dispatch({
      type: "ADD_CUSTOM_BEAN",
      bean
    });
  };
}

export function editCustomBean(beanId, bean) {
  return dispatch => {
    dispatch({
      type: "EDIT_CUSTOM_BEAN",
      beanId,
      bean
    });
  };
}

export function deleteCustomBean(beanId) {
  return {
    type: "DELETE_CUSTOM_BEAN",
    beanId
  };
}
