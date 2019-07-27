import { syncAllLocalChanges, fetchCoffees } from "./coffee";

export function login(profile) {
  return (dispatch, getState) => {
    dispatch({
      type: "LOGGED_IN",
      data: profile
    });

    const fetchSync = fetchCoffees(() => {
      const changesSync = syncAllLocalChanges();
      changesSync(dispatch, getState);
    });

    fetchSync(dispatch, getState);
  };
}

export function logout() {
  return dispatch => {
    dispatch({
      type: "LOGGED_OUT"
    });
  };
}
