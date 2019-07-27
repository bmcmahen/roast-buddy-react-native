export function push(key, extra = {}) {
  const route = { key, ...extra };
  return {
    type: "PUSH",
    route
  };
}

export function pop() {
  return {
    type: "POP"
  };
}

export function viewRoast(roastId) {
  return {
    type: "SELECT_TAB_AND_ROUTE",
    route: {
      key: "List View Roast",
      roastId
    },
    tabKey: "list"
  };
}
