// @flow

import _ from "lodash";
import shortid from "shortid";
import { REHYDRATE } from "redux-persist/constants";
import moment from "moment";

/**
 * Coffee
 */

const defaultCoffee = () => ({
  _id: shortid.generate(),
  name: "",
  date: moment.utc().format(),
  beans: [],
  reviews: [],
  roasts: [],
  other: [],
  status: "dirty",
  isNew: true
});

const coffee = (state, action) => {
  if (action.type === "ADD_COFFEE") {
    switch (action.status) {
      case "dirty": {
        if (!action.data) {
          throw new Error(
            "Adding a coffee with init status must include a data attribute"
          );
        }
        const { name, _id, reviews, date, roasts, beans } = action.data;
        return {
          ...state,
          name,
          _id,
          isNew: true,
          reviews,
          date,
          roasts,
          beans,
          status: action.status
        };
      }
      case "sync":
      case "sync-error":
        if (action._id === state._id) {
          return {
            ...state,
            status: action.status
          };
        }
      case "sync-success":
        if (action._id === state._id) {
          return {
            ...state,
            isNew: false,
            status: action.status
          };
        }
    }
  }

  if (action.type === "FETCH_COFFEES") {
    return {
      ...state,
      status: "sync-success",
      isNew: false
    };
  }

  if (action.type === "CHANGE_COFFEE") {
    if (state._id === action._id) {
      return {
        ...state,
        ...action.data,
        status: action.status
      };
    }
  }

  return state;
};

/**
 * Coffees
 */

const defaultCoffeesState = () => ({
  isFetching: false,
  items: [],
  deleting: {}
});

const coffees = (state = defaultCoffeesState(), action) => {
  if (action.type === "ADD_COFFEE") {
    switch (action.status) {
      case "dirty":
        return {
          ...state,
          items: [...state.items, coffee(defaultCoffee(), action)]
        };
      case "sync":
      case "sync-error":
      case "sync-success":
        return {
          ...state,
          items: state.items.map(r => coffee(r, action))
        };
    }
  }

  if (action.type === "FETCH_COFFEES") {
    switch (action.status) {
      case "sync":
        return { ...state, isFetching: true };
      case "sync-error":
        return { ...state, isFetching: false };
      case "sync-success":
        if (!action.items) {
          throw new Error("A sync success must pass an items array");
        }
        const items = syncData(
          state.items,
          action.items,
          r => coffee(r, action),
          state.deleting
        );
        return { ...state, isFetching: false, items };
    }
  }

  if (action.type === "REMOVE_COFFEE") {
    const actionId = action._id;
    switch (action.status) {
      case "dirty": {
        const itemToDelete = _.find(state.items, (item, i) => {
          if (item._id === actionId) {
            return true;
          }
        });

        const items = _.filter(state.items, i => {
          return i._id !== itemToDelete._id;
        });

        console.log("existing items", items);

        if (!itemToDelete._id) {
          console.warn("Coffee is already removed");
          return state;
        }

        // if the model has not yet been saved on the
        // server, then just remove it locally.
        // (what if it's in the process of being saved?)
        if (itemToDelete.isNew) {
          return {
            ...state,
            items
          };
        }

        return {
          ...state,
          deleting: {
            ...state.deleting,
            [action._id]: itemToDelete
          },
          items
        };
      }

      case "sync-error":
        let item = state.deleting[action._id];
        if (item && item._id) {
          return {
            ...state,
            deleting: {
              ...state.deleting,
              [action._id]: undefined
            },
            items: [...state.items, item]
          };
        }

      case "sync-success":
        return {
          ...state,
          deleting: {
            ...state.deleting,
            [action._id]: undefined
          }
        };
    }
  }

  if (action.type === "CHANGE_COFFEE") {
    return {
      ...state,
      items: state.items.map(r => coffee(r, action))
    };
  }

  // don't persist 'isFetching'
  if (action.type === REHYDRATE) {
    const incoming = action.payload.coffees;
    if (incoming) {
      const items = incoming.items.map(item => {
        if (item.status === "sync") {
          return {
            ...item,
            status: "sync-error"
          };
        }

        return item;
      });

      return {
        ...state,
        ...incoming,
        items,
        isFetching: false
      };
    }
  }

  return state;
};

function syncData(existing, fetched, processFn, deleting) {
  console.log("existing: %o, fetched: %o", existing, fetched);

  const dirtyIds = [];
  const dirty = _.filter(existing, item => {
    if (item.status !== "sync-success") {
      dirtyIds.push(item._id);
    }
    return item.status !== "sync-success";
  });

  const deletingKeys = Object.keys(deleting);
  const filtered = _.filter(fetched, item => {
    return dirtyIds.indexOf(item._id) < 0 && deletingKeys.indexOf(item._id) < 0;
  });

  const processed = filtered.map(r => processFn(r));
  return processed.concat(dirty);
}

export default coffees;
