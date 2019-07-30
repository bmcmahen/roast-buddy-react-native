import React from "react";
import { Base, TouchableInput, InputGroup, Text, config } from "../components";
import {
  View,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
  Alert,
  ActionSheetIOS,
  Platform,
  ScrollView
} from "react-native";
import { logout } from "../actions/user";
import Sync from "./Sync";
import { BlurView } from "expo-blur";
import EmptyHint from "../RoastList/EmptyHint";

const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

const AnimatedBlur = Animated.createAnimatedComponent(
  Platform.OS === "ios" ? BlurView : View
);
export default class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll: new Animated.Value(0)
    };
  }

  _showSettings() {
    if (Platform.OS === "android") {
      Alert.alert(
        "Sign out?",
        "Are you sure you want to sign out from Roast Buddy?",
        [
          { text: "Cancel", onPress: () => {} },
          { text: "Sign out", onPress: () => this._signOut() }
        ]
      );
    } else if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Sign out", "Cancel"],
          title: "Sign out from Roast Buddy?",
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0
        },
        i => {
          if (i === 1) return;
          if (i === 0) {
            this._signOut();
          }
        }
      );
    }
  }

  _signOut() {
    this.props.dispatch(logout());
  }

  render() {
    const screen = Dimensions.get("window");

    const { user, hasRoasts } = this.props;

    return (
      <Base flex={1} p={0} backgroundColor={config.colors.gray}>
        <StatusBar hidden />
        <AnimatedImage
          source={{
            uri:
              "https://images.pexels.com/photos/606544/pexels-photo-606544.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          }}
          resizeMode="cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            alignSelf: "stretch",
            height: 400,
            transform: [
              {
                scale: this.state.scroll.interpolate({
                  inputRange: [-150, 0],
                  outputRange: [2, 1],
                  extrapolate: "clamp"
                })
              }
            ]
          }}
        >
          <AnimatedBlur
            style={{
              flex: 1,
              paddingTop: 30,
              opacity: this.state.scroll.interpolate({
                inputRange: [0, 150],
                outputRange: [0, 1],
                extrapolate: "clamp"
              }),
              ...Platform.select({
                android: {
                  backgroundColor: "#333"
                }
              })
            }}
            blurType="dark"
          >
            <Animated.Text
              style={{
                textAlign: "center",
                alignSelf: "center",
                color: "rgba(255,255,255,0.95)",
                fontSize: 17,
                fontWeight: "bold",
                opacity: this.state.scroll.interpolate({
                  inputRange: [200, 220],
                  outputRange: [0, 1],
                  extrapolate: "clamp"
                })
              }}
            >
              {user.name}
            </Animated.Text>
          </AnimatedBlur>
        </AnimatedImage>

        <ScrollView
          scrollEventThrottle={7}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scroll } } }
          ])}
          style={{ flex: 1, marginTop: 64, zIndex: 500 }}
          scrollIndicatorInsets={{ top: 200 }}
          contentContainerStyle={{
            marginTop: 200 - 64 - 50,
            paddingTop: 20,
            overflow: "visible",
            backgroundColor: "transparent",
            minHeight: screen.height - 200
          }}
        >
          <Animated.Image
            source={{ uri: user.picture.data.url }}
            style={{
              height: 100,
              width: 100,
              zIndex: 10,
              borderRadius: 10,
              position: "absolute",
              top: 30,
              left: screen.width / 2 - 100 / 2,
              borderWidth: 4,
              borderColor: "white",
              transform: [
                {
                  translateY: this.state.scroll.interpolate({
                    inputRange: [0, 150],
                    outputRange: [0, 30],
                    extrapolate: "clamp"
                  })
                },
                {
                  translateX: this.state.scroll.interpolate({
                    inputRange: [0, 150],
                    outputRange: [0, -50],
                    extrapolate: "clamp"
                  })
                },
                {
                  scale: this.state.scroll.interpolate({
                    inputRange: [0, 150],
                    outputRange: [1, 0.5],
                    extrapolate: "clamp"
                  })
                }
              ]
            }}
          />
          <Base flex={1} style={{ paddingTop: 60, zIndex: 0 }}>
            <Base flex={1} backgroundColor={config.colors.gray}>
              <Text
                textAlign="center"
                numberOfLines={1}
                style={{ marginTop: 60 }}
                giant
                bold
              >
                {user.name}
              </Text>

              <Base mt={3}>
                <Sync
                  dispatch={this.props.dispatch}
                  roasts={this.props.roasts}
                />
              </Base>
              <InputGroup mt={3} mb={3}>
                <TouchableInput
                  label="Sign out"
                  showMore
                  onPress={this._showSettings.bind(this)}
                />
              </InputGroup>
            </Base>
          </Base>
        </ScrollView>
        {!hasRoasts && <EmptyHint />}
      </Base>
    );
  }
}
