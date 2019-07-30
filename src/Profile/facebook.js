const ROOT_URL = `https://graph.facebook.com/`;

export async function loginWithFacebook(token) {
  try {
    const res = await fetch(
      `${ROOT_URL}/me?fields=name,about,first_name,last_name,gender,picture.width(300).height(300),cover&access_token=${token}`
    );
    if (!res.ok) {
      throw new Error("Bad request");
    }
    const json = await res.json();
    console.log("response", res);
    return json;
  } catch (err) {}
}

export function logOut() {
  return dispatch => {
    // clear FB api
    return dispatch({
      type: "LOGGED_OUT"
    });
  };
}
