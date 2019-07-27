// @flow

import eachOfLimit from "async/eachOfLimit";
import request from "./request";

export function addReview(_id, reviews) {
  return changeCoffee(_id, { reviews });
}

export function toggleFavourite(_id, status) {
  return changeCoffee(_id, { isFavourite: status });
}

export function changeCoffeeSync(_id, coffee, fn) {
  return (dispatch, getState) => {
    // don't sink if not logged in
    const state = getState();
    if (!state.user.isLoggedIn) return;

    const existing = getState().coffees.items.find(c => {
      return c._id === _id;
    });

    // don't sink if the existing is still marked as 'new'
    if (existing && existing.isNew) return;

    dispatch({
      type: "CHANGE_COFFEE",
      status: "sync",
      _id,
      data: coffee
    });

    request("/coffee/" + _id, "PUT", coffee)
      .then(json => {
        dispatch({
          type: "CHANGE_COFFEE",
          status: "sync-success",
          _id,
          data: json
        });

        if (fn) fn(null, json);
      })
      .catch(err => {
        dispatch({
          type: "CHANGE_COFFEE",
          status: "sync-error",
          _id,
          data: coffee
        });
        if (fn) fn(err);
      });
  };
}

export function changeCoffee(_id, coffee) {
  return (dispatch, getState) => {
    dispatch({
      type: "CHANGE_COFFEE",
      data: coffee,
      _id,
      status: "dirty"
    });

    const syncFn = changeCoffeeSync(_id, coffee);
    syncFn(dispatch, getState);
  };
}

export function addCoffeeSync(_id, coffee, fn) {
  return (dispatch, getState) => {
    // Sync if we are logged in
    const state = getState();
    if (!state.user.isLoggedIn) return;

    // Attempt the sync even if we are offline.
    // It's easier to assume we are online, catch
    // the error, and handle it that way, since we would
    // need to do this anyway.
    dispatch({
      type: "ADD_COFFEE",
      status: "sync",
      _id
    });

    request("/coffee", "POST", coffee)
      .then(json => {
        dispatch({
          type: "ADD_COFFEE",
          status: "sync-success",
          _id,
          data: json
        });

        if (fn) fn(null, json);
      })
      .catch(err => {
        dispatch({
          type: "ADD_COFFEE",
          status: "sync-error",
          _id
        });

        if (fn) fn(err);
      });
  };
}

export function addCoffee(_id, coffee, fn) {
  return (dispatch, getState) => {
    if (!coffee.name) {
      delete coffee.name;
    }

    dispatch({
      type: "ADD_COFFEE",
      status: "dirty",
      data: coffee,
      _id
    });

    const fn = addCoffeeSync(_id, coffee);
    return fn(dispatch, getState);
  };
}

export function fetchCoffees(fn) {
  return (dispatch, getState) => {
    const { coffees } = getState();
    if (coffees.isFetching) {
      console.log("coffee already fetching");
      return;
    }

    dispatch({
      type: "FETCH_COFFEES",
      status: "sync"
    });

    request("/coffee")
      .then(json => {
        dispatch({
          type: "FETCH_COFFEES",
          status: "sync-success",
          items: json
        });
        if (fn) fn(null, json);
      })
      .catch(err => {
        dispatch({
          type: "FETCH_COFFEES",
          status: "sync-error"
        });
        if (fn) fn(err);
      });
  };
}

export function removeCoffeeSync(_id, coffee, fn) {
  return (dispatch, getState) => {
    // only sync if coffee has a 'sync-success' status
    // only sync if the user is not logged in
    if (coffee.status !== "sync-success") return;
    const { user } = getState();
    if (!user.isLoggedIn) return;

    dispatch({
      type: "REMOVE_COFFEE",
      _id,
      status: "sync"
    });

    request("/coffee/" + _id, "DELETE")
      .then(() => {
        dispatch({
          type: "REMOVE_COFFEE",
          _id,
          status: "sync-success"
        });
        if (fn) fn();
      })
      .catch(err => {
        dispatch({
          type: "REMOVE_COFFEE",
          _id,
          status: "sync-error"
        });
        if (fn) fn(err);
      });
  };
}

export function removeCoffee(_id, coffee) {
  return (dispatch, getState) => {
    dispatch({
      type: "REMOVE_COFFEE",
      _id,
      status: "dirty"
    });

    const fn = removeCoffeeSync(_id, coffee);
    return fn(dispatch, getState);
  };
}

// Sync anything that is in the 'dirty' or 'sync-error' phase.
// Typically you would do this when the user first logs in.
// Basically, we create a queue of actions to take.
export function syncAllLocalChanges(fn) {
  return (dispatch, getState) => {
    console.log("sync local changes");

    const coffees = getState().coffees;
    const roastsToPost = [];
    const roastsToPut = [];
    const roastsToDel = [];

    coffees.items.forEach(coffee => {
      if (coffee.status === "sync-error" || coffee.status === "dirty") {
        if (coffee.isNew) {
          roastsToPost.push(coffee);
        } else {
          roastsToPut.push(coffee);
        }
      }
    });

    Object.keys(coffees.deleting).forEach(key => {
      if (coffees.deleting[key]) {
        roastsToDel.push(coffees.deleting[key]);
      }
    });

    function postSync() {
      eachOfLimit(
        roastsToPost,
        3,
        (item, key, fn) => {
          console.log("add coffee sync");
          const syncFn = addCoffeeSync(item._id, item, () => {
            console.log("add coffee sync callback");
            fn();
          });
          syncFn(dispatch, getState);
        },
        next => putSync()
      );
    }

    postSync();

    function putSync() {
      eachOfLimit(
        roastsToPut,
        3,
        (item, key, fn) => {
          const syncFn = changeCoffeeSync(item._id, item, () => fn());
          syncFn(dispatch, getState);
        },
        next => removeSync()
      );
    }

    function removeSync() {
      eachOfLimit(
        roastsToDel,
        3,
        (item, key, fn) => {
          const syncFn = removeCoffeeSync(item._id, item, () => fn());
          syncFn(dispatch, getState);
        },
        () => {
          console.log("done sync");
          if (fn) fn();
        }
      );
    }
  };
}
