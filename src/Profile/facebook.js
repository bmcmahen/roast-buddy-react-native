import * as Facebook from "expo-facebook";

const { GraphRequest, GraphRequestManager } = Facebook;

export function loginWithFacebook() {
  return new Promise((resolve, reject) => {
    function callback(err, profile) {
      if (err) return reject(err);
      return resolve(profile);
    }

    const request = new GraphRequest(
      "/me",
      {
        parameters: {
          fields: {
            string:
              "name,bio,about,first_name,last_name,gender,picture.type(large),cover"
          }
        }
      },
      callback
    );

    new GraphRequestManager().addRequest(request).start();
  });
}

export function logOut() {
  return dispatch => {
    // clear FB api
    return dispatch({
      type: "LOGGED_OUT"
    });
  };
}
