// @flow
import React from "react";
import { connect } from "react-redux";
import shortid from "shortid";
import _ from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import {
  ScrollView,
  Modal,
  StyleSheet,
  TouchableHighlight,
  Keyboard,
  Platform,
  LayoutAnimation,
  View
} from "react-native";
import {
  Base,
  Icon,
  InputGroup,
  InputRow,
  InputExpandable,
  InputTouchable,
  InputAddRow,
  Text
} from "../components";
import Recorder from "./Recorder";
import Degrees from "./Degrees";
import Menu from "../utils/Menu";

const propsForKeys = {
  "Roast Weight": {
    placeholder: "(g)",
    keyboardType: "numeric"
  },
  "Roast Duration": {
    placeholder: "(seconds)",
    keyboardType: "numeric"
  },
  Temperature: { placeholder: "(c)" },
  Notes: {
    placeholder: "Your notes...",
    vertical: true,
    condensed: false,
    verticalHeight: 150,
    multiline: true
  },
  Date: {},
  Other: {
    vertical: true,
    condensed: false,
    placeholder: "Your text..."
  }
};

import { DEGREES } from "../data";
import { RoastWeight, RoastTemperature, RoastDuration } from "./MetaFields";

class RecordRoast extends React.Component {
  constructor(props, context) {
    super(props, context);

    const addField = label => {
      const i = this.state.i;
      LayoutAnimation.spring();
      props.roast.roasts[i].other.push({
        _id: shortid.generate(),
        label,
        value: ""
      });
      this._changeAtIndex(i, {
        other: props.roast.roasts[i].other
      });
    };

    this._options = [
      {
        key: "Roast Weight",
        label: "Roast Weight",
        onPress: () => addField("Roast Weight")
      },
      {
        key: "Roast Duration",
        label: "Roast Duration",
        onPress: () => addField("Roast Duration")
      },
      {
        key: "Temperature",
        label: "Temperature",
        onPress: () => addField("Temperature")
      },
      {
        key: "Notes",
        label: "Notes",
        onPress: () => addField("Notes")
      }
    ];

    this.state = {
      modal: false,
      menu: false,
      options: this._options,
      labels: ["Roast Weight", "Roast Duration", "Temperature", "Notes"],
      recording: props.roast.roasts.map(() => {
        return {
          isRecording: false,
          hasStarted: false,
          seconds: 0
        };
      }),
      expanded: props.roast.roasts.map((r, i) => {
        if (i === 0) return true;
        return false;
      })
    };
  }

  componentDidMount() {
    activateKeepAwake();
  }

  componentWillUnmount() {
    deactivateKeepAwake();
  }

  render() {
    const { roast } = this.props;

    const ScrollComponent =
      Platform.OS === "android" ? ScrollView : KeyboardAwareScrollView;

    return (
      <Base flex={1} backgroundColor="white">
        <Menu
          options={this.state.options}
          showing={this.state.menu}
          onRequestClose={() => this.setState({ menu: false })}
          showCancel
          autoDismiss
        />
        <Modal
          animationType="fade"
          transparent
          visible={typeof this.state.modal === "number"}
          onRequestClose={() => {
            this.setState({ modal: false });
          }}
        >
          <Degrees
            index={this.state.modal}
            onRequestClose={() => {
              this.setState({ modal: false });
            }}
          />
        </Modal>
        <ScrollComponent
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          automaticallyAdjustContentInsets={false}
          style={{ flex: 1, padding: 0, margin: 0 }}
        >
          {roast.roasts.map((r, i) => this._renderRoast(r, i))}
        </ScrollComponent>
      </Base>
    );
  }

  _renderRoast(roast, i) {
    const isExpanded = this.state.expanded[i];

    const row = (
      <TouchableHighlight
        underlayColor={"rgba(0,0,0,0.4)"}
        onPress={
          this.props.roast.roasts.length > 1
            ? () => {
                LayoutAnimation.spring();
                this.setState(state => {
                  state.expanded[i] = !state.expanded[i];
                  return state;
                });
              }
            : null
        }
      >
        <View
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: "white"
          }}
        >
          <Base row p={2} alignItems="center" backgroundColor="black">
            <Text numberOfLines={1} pr={2} flex={1} large color="white">
              {roast.beans.map(b => b.name).join(", ")}
            </Text>
            <Icon
              size={25}
              name={isExpanded ? "ios-arrow-down" : "ios-arrow-forward"}
              color="white"
            />
          </Base>
        </View>
      </TouchableHighlight>
    );

    return (
      <Base key={roast._id}>
        <InputExpandable expanded={this.state.expanded[i]} Row={row}>
          <View
            style={{
              alignSelf: "stretch",
              paddingTop: 0,
              flex: 1,
              backgroundColor: "white"
            }}
          >
            <Recorder
              roast={roast}
              onRemoveAllCracks={this._onRemoveAllCracks.bind(this, i)}
              onAddCrack={crack => this._onAddCrack(crack, i)}
              onRemoveCrack={() => this._onRemoveCrack(i)}
              onStartRecording={() => {
                this.props.dispatch({
                  type: "START_RECORDING"
                });

                this.setState(state => {
                  state.recording[i].isRecording = true;
                  return state;
                });
              }}
              onEndRecording={time => {
                this.props.dispatch({
                  type: "STOP_RECORDING"
                });

                this.setState(state => {
                  state.recording[i].isRecording = false;
                  return state;
                });
              }}
              onDurationUpdate={seconds => {
                this._updateDuration(seconds, i);
              }}
            />
            <InputGroup inset={16} mt={0}>
              {/* Roast degree */}
              <InputTouchable
                label="Degree of Roast"
                backgroundColor="white"
                showMore
                value={
                  typeof roast.degree !== "undefined"
                    ? DEGREES[roast.degree].label
                    : "none selected"
                }
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ modal: i });
                }}
              />

              {/* Other Fields */}
              {roast.other.map((other, p) => {
                const isLast = p === roast.other.length - 1;
                if (other.label === "Roast Weight") {
                  return (
                    <RoastWeight
                      backgroundColor="white"
                      key={other.label}
                      value={other.value}
                      onRequestRemove={this._onRemove.bind(this, other, p, i)}
                      onValueChange={text => {
                        this._onChangeText(text, other, p, i);
                      }}
                    />
                  );
                }

                if (other.label === "Temperature") {
                  return (
                    <RoastTemperature
                      key={other.label}
                      value={other.value}
                      onRequestRemove={this._onRemove.bind(this, other, p, i)}
                      onValueChange={text => {
                        this._onChangeText(text, other, p, i);
                      }}
                    />
                  );
                }

                if (other.label === "Roast Duration") {
                  return (
                    <RoastDuration
                      onRequestRemove={this._onRemove.bind(this, other, p, i)}
                      key={other.label}
                      value={other.value}
                      onValueChange={v => {
                        this._onChangeText(v, other, p, i);
                      }}
                    />
                  );
                }

                return (
                  <InputRow
                    {...propsForKeys[other.label]}
                    key={other._id}
                    removable
                    defaultValue={other.value}
                    backgroundColor="white"
                    labelWidth={100}
                    style={{ textAlignVertical: "top" }}
                    autoFocus={isLast}
                    onRequestRemove={this._onRemove.bind(this, other, p, i)}
                    label={other.label}
                    onChangeText={text => {
                      this._onChangeText(text, other, p, i);
                    }}
                    value={other.value}
                  />
                );
              })}

              {/* Allow user to add other fields */}
              {this.state.options.length > 0 && (
                <InputAddRow
                  labelColor="black"
                  backgroundColor="white"
                  label="Add field"
                  onPress={() => this._addRow(i)}
                />
              )}
            </InputGroup>
          </View>
        </InputExpandable>
      </Base>
    );
  }

  _close() {
    this.props.dispatch({
      type: "HIDE_RECORD"
    });
  }

  _save() {}

  _updateDuration(seconds, i) {
    this._changeAtIndex(i, { recordedTime: seconds });
  }

  _onAddCrack(crack, i) {
    LayoutAnimation.spring();
    this.props.roast.roasts[i].cracks.push(crack);
    this._changeAtIndex(i, { cracks: this.props.roast.roasts[i].cracks });
  }

  _onRemoveCrack(i) {
    LayoutAnimation.spring();
    const r = this.props.roast.roasts[i];
    r.cracks.pop();
    this._changeAtIndex(i, { cracks: r.cracks });
  }

  _changeAtIndex(i, change) {
    this.props.roast.roasts[i] = {
      ...this.props.roast.roasts[i],
      ...change
    };

    this.props.dispatch({
      type: "ROAST_CHANGE",
      roasts: this.props.roast.roasts
    });
  }

  _onRemoveAllCracks(i) {
    LayoutAnimation.spring();
    this._changeAtIndex(i, { cracks: [] });
  }

  _onRemove(field, i, roastIndex) {
    LayoutAnimation.spring();
    const r = this.props.roast.roasts[roastIndex];
    r.other.splice(i, 1);
    this._changeAtIndex(roastIndex, { other: r.other });
  }

  _addRow(i) {
    const addField = label => {
      LayoutAnimation.spring();
      this.props.roast.roasts[i].other.push({
        _id: shortid.generate(),
        label,
        value: ""
      });
      this._changeAtIndex(i, {
        other: this.props.roast.roasts[i].other
      });
    };

    const options = this._options;
    const others = this.props.roast.roasts[i].other;

    const filtered = _.filter(options, opt => {
      if (!others.length) return true;
      return !others.some(o => {
        return o.label === opt.label;
      });
    });

    this.setState({
      options: filtered,
      menu: true,
      i: i
    });

    // const cancelIndex = filtered.length - 1
    //
    // ActionSheetIOS.showActionSheetWithOptions({
    //   options: filtered,
    //   cancelButtonIndex: cancelIndex,
    //   title: 'Field Type'
    // }, (i) => {
    //   if (i === cancelIndex) return
    //   addField(filtered[i])
    // })
  }

  _onChangeText(text, field, i, roastIndex) {
    const roast = this.props.roast.roasts[roastIndex];
    roast.other[i].value = text;
    this._changeAtIndex(roastIndex, { other: roast.other });
  }

  _set(field) {
    return value => {
      this.setState(state => {
        state.roast[field] = value;
        return state;
      });
    };
  }
}

function getState(state) {
  return {
    roast: state.roast
  };
}

export default connect(getState)(RecordRoast);

const styles = StyleSheet.create({
  navTop: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.15)",
    paddingTop: 20
  }
});
