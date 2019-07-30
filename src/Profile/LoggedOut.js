import React from "react";
import { Base, Button, Loader, Image, Text } from "../components";
import { Dimensions, Alert, StatusBar } from "react-native";
import * as Facebook from "expo-facebook";
import { loginWithFacebook } from "./facebook";
import { login } from "../actions/user";
import { facebook } from "../config";

const { AccessToken, LoginManager } = Facebook;

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  _getToken() {
    AccessToken.getCurrentAccessToken()
      .then(data => {
        console.log(data);
      })
      .catch(this._loginError.bind(this));
  }

  async _requestProfile(token) {
    try {
      const profile = await loginWithFacebook(token);
      // dispatch our login event
      console.log("Profile", profile);
      this.props.dispatch(login(profile));
      // this.setState({ loading: false })
    } catch (err) {
      this._loginError(err);
    }
  }

  _loginError(err) {
    console.warn(err);
    this.setState({ loading: false });
    Alert.alert(
      "An error occurred while logging in.",
      "Please try again later."
    );
  }

  _login() {
    Facebook.logInWithReadPermissionsAsync(facebook, {
      permissions: ["public_profile"]
    })
      .then(result => {
        if (result.type === "cancel") return;

        console.log("Logged in with %o", result);
        this.setState({ loading: true });
        this._requestProfile(result.token);
      })
      .catch(this._loginError.bind(this));
  }

  render() {
    const screen = Dimensions.get("window");

    return (
      <Base flex={1} backgroundColor="black">
        {/* <StatusBar barStyle="light-content" /> */}
        <Image
          fade
          resizeMode="cover"
          source={require("./login.jpg")}
          style={{
            position: "absolute",
            width: screen.width,
            height: screen.height,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
        />

        <Base flex={1} justifyContent="center" alignItems="center">
          <Base px={2} mt={2} backgroundColor="transparent">
            <Text textAlign="center" giant bold color="white">
              Roast Buddy is better when you register an account.
            </Text>
            <Text textAlign="center" mt={3} color="rgba(255,255,255,0.9)">
              Automatically save your roasts to the cloud, providing access from
              any device.
            </Text>
            <Text textAlign="center" my={2} color="rgba(255,255,255,0.9)">
              Allow us to better personalize your experience.
            </Text>
          </Base>
          <Button
            width={275}
            onPress={this.state.loading ? null : this._login.bind(this)}
            mt={3}
            iconColor="white"
            intent="primary"
            alignSelf="center"
            large
            outline
            iconBefore={"facebook"}
            underlayColor="rgba(0,0,0,0.2)"
          >
            {this.state.loading ? (
              <Loader color="white" />
            ) : (
              <Base row alignItems="center">
                <Text color="white">Login with Facebook</Text>
              </Base>
            )}
          </Button>
          <Text
            tiny
            textAlign="center"
            my={1}
            backgroundColor="transparent"
            color="rgba(255,255,255,0.85)"
          >
            We promise not to post on your Facebook.
          </Text>
        </Base>
      </Base>
    );
  }
}

export default LoggedOut;
