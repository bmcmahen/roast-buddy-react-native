import { api } from "../config";

async function getBeans() {
  try {
    const res = await fetch(`${api}/beans`);
    return await res.json();
  } catch (err) {
    console.warn(err);
    throw err;
  }
}

export function fetchBeans() {
  return dispatch => {
    dispatch({
      type: "LOADED_BEANS",
      status: "sync"
    });

    getBeans()
      .then(beans => {
        console.log("received beans %o", beans);
        dispatch({
          type: "LOADED_BEANS",
          status: "sync-success",
          beans
        });
      })
      .catch(err => {
        dispatch({
          type: "LOADED_BEANS",
          status: "sync-error"
        });
      });
  };
}
