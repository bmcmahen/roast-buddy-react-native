const initialState = {
  isLoggedIn: false,
  id: null,
  name: null,
  bio: null,
  cover: {},
  first_name: null,
  last_name: null,
  picture: {
    data: {}
  }
};

export default function user(state = initialState, action) {
  if (action.type === "LOGGED_IN") {
    const {
      id,
      gender,
      first_name,
      last_name,
      bio,
      about,
      cover,
      picture,
      name
    } = action.data;

    return {
      isLoggedIn: true,
      id,
      name,
      bio: bio || about,
      gender,
      first_name,
      last_name,
      cover,
      picture
    };
  }

  if (action.type === "LOGGED_OUT") {
    return initialState;
  }

  if (action.type === "RESET") {
    return initialState;
  }

  return state;
}
