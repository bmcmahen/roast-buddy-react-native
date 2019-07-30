/**
 * Individual Bean
 */

function bean(state, action) {
  if (action.type === "LOADED_BEANS") {
    return state;
  }

  return state;
}

/**
 * Beans List (fetched from server)
 */

const initialState = {
  status: null,
  beans: [],
  beansById: {}
};

export default function beans(state = initialState, action) {
  if (action.type === "LOADED_BEANS") {
    if (action.status === "sync-success") {
      if (!action.beans) {
        throw new Error("beans required");
      }

      const beansById = {};
      const beans = action.beans.map(b => {
        const def = bean(b, action);
        beansById[b._id] = def;
        return def;
      });

      return {
        status: "sync-success",
        beans,
        beansById
      };
    }

    if (action.status === "sync-error") {
      return { ...state, status: "sync-error" };
    }

    if (action.status === "sync") {
      return { ...state, status: "sync" };
    }
  }

  return state;
}
