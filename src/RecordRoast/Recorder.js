import React from "react";
import {
  Animated,
  TouchableHighlight,
  LayoutAnimation,
  Platform,
  View
} from "react-native";
import {
  Base,
  Divider,
  Text,
  Icon,
  TouchableIcon,
  NavTouchableText
} from "../components";

/**
 * Recorder
 */

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this._previous = 0;
    this.state = this.cleanState();
  }

  cleanState() {
    return {
      isRecording: false,
      hasRecorded: false,
      currentDuration: 0,
      currentStage: 0,
      stages: [
        {
          key: "first_crack",
          label: "First Crack"
        },
        {
          key: "first_crack_finished",
          label: "End First Crack"
        },
        {
          key: "second_crack",
          label: "Second Crack"
        },
        {
          key: "second_crack_finished",
          label: "End Second Crack"
        }
      ]
    };
  }

  selectStage() {
    const { stages, currentStage, currentDuration } = this.state;

    const stage = stages[currentStage];
    this.props.onAddCrack({
      key: stage.key,
      time: currentDuration
    });

    this.setState({ currentStage: currentStage + 1 });
  }

  renderCrack(crack, i) {
    const labels = {
      first_crack: "Start of first crack",
      first_crack_finished: "End of first crack",
      second_crack: "Start of second crack",
      second_crack_finished: "End of second crack"
    };

    const isLast = this.props.roast.cracks.length === i + 1;

    return (
      <Base key={crack.key} pr={0} pl={2}>
        <Base height={45} alignItems="center" row flex={1}>
          <Base width={40} alignItems="center" justifyContent="center">
            {isLast && (
              <TouchableIcon
                flex={1}
                accessibilityLabel="Remove"
                onPress={() => {
                  this.props.onRemoveCrack(i);
                  this.setState({ currentStage: i });
                }}
              >
                <Icon name="x" color="#aaa" size={24} />
              </TouchableIcon>
            )}
          </Base>
          <Text light thin mr={2} flex={1}>
            {labels[crack.key]}
          </Text>

          <View flex="1" />
          <Text large thin mr={2}>
            {this.formatDuration(crack.time)}
          </Text>
        </Base>
        <Divider inset={0} />
      </Base>
    );
  }

  start(preserve) {
    LayoutAnimation.spring();

    this.setState({ isRecording: true, hasRecorded: true });

    if (preserve) {
      this._previous = this.state.currentDuration;
    } else {
      this._previous = 0;
    }

    this._start = new Date().getTime();

    const { onStartRecording, onDurationUpdate } = this.props;

    onStartRecording();

    this._timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const currentDuration = this._previous + (currentTime - this._start);
      this.setState({ currentDuration });
    }, 1000);
  }

  end() {
    LayoutAnimation.spring();
    clearInterval(this._timer);
    this.setState({ isRecording: false });
    this.props.onEndRecording(this.state.currentDuration);
    this.props.onDurationUpdate(this.state.currentDuration);
  }

  componentWillUnmount() {
    this.end();
  }

  formatDuration(currentDuration) {
    const minute = Math.floor(currentDuration / (60 * 1000));
    const second = Math.floor((currentDuration - 60000 * minute) / 1000);
    const ms = Math.floor((currentDuration % 1000) / 10);

    const total =
      (minute < 10 ? "0" + minute : minute) +
      ":" +
      (second < 10 ? "0" + String(second) : second);

    return total;
  }

  render() {
    const {
      currentDuration,
      isRecording,
      hasRecorded,
      stages,
      currentStage
    } = this.state;

    const { roast } = this.props;

    const total = this.formatDuration(currentDuration);

    let startLabel = isRecording ? "Pause" : "Start";
    if (hasRecorded && !isRecording) {
      startLabel = "Resume";
    }

    const stage = stages[currentStage];

    return (
      <Animated.View
        style={{
          paddingBottom: 0,
          marginTop: 0,
          backgroundColor: "white"
          // borderBottomWidth: StyleSheet.hairlineWidth,
          // borderBottomColor: 'rgba(0,0,0,0.25)'
        }}
      >
        <Base
          pt={3}
          pb={0}
          style={{
            backgroundColor: "white"
            // borderBottomWidth: StyleSheet.hairlineWidth,
            // borderBottomColor: 'rgba(0,0,0,0.25)'
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            thin
            style={{
              fontWeight: "100",
              lineHeight: 70,
              fontVariant: ["tabular-nums"],
              fontSize: 70
            }}
          >
            {total}
          </Text>
        </Base>

        <Base
          flex={1}
          py={2}
          pt={3}
          pb={3}
          alignSelf="center"
          width={200}
          row
          alignItems="center"
          justifyContent="center"
        >
          {!isRecording && hasRecorded ? (
            <TouchableHighlight
              disabled={currentDuration == 0}
              underlayColor="rgba(0,0,0,0.1)"
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "red",
                width: 70,
                height: 70,
                borderRadius: 35
              }}
              onPress={
                currentDuration == 0
                  ? null
                  : () => {
                      this.props.onRemoveAllCracks();
                      this.setState({ currentStage: 0 });
                      this.start();
                    }
              }
            >
              <View style={{ backgroundColor: "transparent" }}>
                <Text small textAlign="center" color="red">
                  Reset
                </Text>
              </View>
            </TouchableHighlight>
          ) : (
            stage && (
              <TouchableHighlight
                underlayColor="rgba(0,0,0,0.1)"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  width: 70,
                  height: 70,
                  borderRadius: 35
                }}
                onPress={
                  currentDuration == 0
                    ? null
                    : () => {
                        this.selectStage();
                      }
                }
              >
                <View style={{ backgroundColor: "transparent" }}>
                  <Text small textAlign="center" color="light">
                    {stage.label}
                  </Text>
                </View>
              </TouchableHighlight>
            )
          )}

          <Animated.View style={{ marginLeft: 20 }}>
            <TouchableHighlight
              underlayColor="rgba(0,0,0,0.1)"
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isRecording ? "red" : "#08e",
                width: 70,
                height: 70,
                borderRadius: 35
              }}
              onPress={() => {
                if (isRecording) {
                  this.end();
                } else {
                  this.start(true);
                }
              }}
            >
              <View style={{ backgroundColor: "transparent" }}>
                <Text small color={isRecording ? "red" : "blue"}>
                  {startLabel}
                </Text>
              </View>
            </TouchableHighlight>
          </Animated.View>
        </Base>

        {roast.cracks.length > 0 && (
          <Base mt={0} mb={3}>
            {roast.cracks.map((crack, i) => {
              return this.renderCrack(crack, i);
            })}
          </Base>
        )}
      </Animated.View>
    );
  }
}

export default Recorder;
