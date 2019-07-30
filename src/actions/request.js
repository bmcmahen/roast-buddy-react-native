// @flow
import * as Facebook from "expo-facebook";
import Debug from "react-native-debug";
import { AsyncStorage } from "react-native";

const log = new Debug("app:request");

import { api } from "../config";

async function request(route, method = "GET", payload) {
  try {
    const token = await AsyncStorage.getItem("fbtoken");

    if (!token) {
      throw new Error("No access token found");
    }

    const params = {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };

    log("request params %o", params);

    if (payload) {
      log("payload %o", payload);

      Object.assign(params, {
        body: JSON.stringify(payload)
      });
    }

    const res = await fetch(api + route, params);

    if (res.status !== 200) {
      throw new Error();
    }

    return await res.json();
  } catch (err) {
    console.warn(err);
    throw err;
  }
}

export default request;
