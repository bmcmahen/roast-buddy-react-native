// @flow
import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlight,
  Modal,
  LayoutAnimation,
  Picker
} from "react-native";
import _ from "lodash";
import SwipeableRow from "react-native-swipeable-row-bouncing";
import {
  Base,
  Text,
  InputPicker,
  InputRow,
  InputToggle,
  InputHelpText,
  AddRow,
  NavTouchableText,
  InputGroup,
  config
} from "../components";
import Melange from "./Melange";

import { connect } from "react-redux";

class Blend extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const hasName = navigation.getParam("hasBlendName");

    return {
      title: "Blend Details",
      headerRight: (
        <NavTouchableText
          disabled={!hasName}
          onPress={() => {
            navigation.navigate("Recorder");
          }}
        >
          Next
        </NavTouchableText>
      )
    };
  };

  constructor(props) {
    super(props);
    this._oneHundred = _.range(0, 100);
    this.state = this._getInitialState(props);
  }

  _getInitialState(props) {
    const count = props.roast.beans.length;

    return {
      toggles: props.roast.beans.map(() => false),
      modal: false
    };
  }

  componentWillMount() {
    const count = this.props.roast.beans.length;
    const basic = this.props.roast.beans.map(b => {
      return { ...b, percentage: Math.floor(100 / count) };
    });

    this.props.dispatch({
      type: "ROAST_CHANGE_BEANS",
      beans: basic
    });
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.roast.beans !== this.props.roast.beans) {
    //   this.setState({
    //     toggles: nextProps.roast.beans.map(() => false)
    //   })
    // }
  }

  // componentDidReceiveProps(nextProps) {
  // reset if our beans change
  // if (nextProps.roast.beans !== this.props.roast.beans) {
  //   this.setState(this._getInitialState(nextProps))
  // }
  // }

  componentDidUpdate(props) {
    if (props.roast.name !== this.props.roast.name) {
      this.props.navigation.setParams({
        hasBlendName: !!this.props.roast.name
      });
    }
  }

  render() {
    const widgets = [];
    const selectedRoast =
      typeof this.state.selectedRoastIndex === "number"
        ? this.props.roast.roasts[this.state.selectedRoastIndex]
        : null;

    return (
      <Base flex={1} backgroundColor={config.colors.gray}>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({
              modal: false,
              selectedRoastIndex: undefined
            });
          }}
        >
          <Melange
            selectedRoast={selectedRoast}
            selectedRoastIndex={this.state.selectedRoastIndex}
            onRequestDelete={() => {
              this._deleteRoast(this.state.selectedRoastIndex);
            }}
            onRequestClose={() => {
              this.setState({
                modal: false,
                selectedRoastIndex: undefined
              });
            }}
          />
        </Modal>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          style={{ flex: 1 }}
        >
          <InputGroup
            inset={16}
            mt={3}
            style={{
              backgroundColor: "white",
              flex: 0,
              flexDirection: "column"
            }}
          >
            <InputRow
              value={this.props.roast.name}
              defaultValue={this.props.roast.name}
              placeholder="Blend name"
              onChangeText={v => {
                this.props.dispatch({
                  type: "ROAST_CHANGE_NAME",
                  name: v
                });
              }}
            />
          </InputGroup>
          <InputGroup
            inset={16}
            mt={3}
            style={{ flex: 0, flexDirection: "column" }}
          >
            {this.props.roast.beans.map((r, i) => {
              if (!r.percentage) return null;

              return (
                <View key={r._id} style={{ flex: 0 }}>
                  <InputPicker
                    flex={0}
                    expanded={this.state.toggles[i]}
                    value={String(r.percentage) + "%"}
                    label={r.name}
                    showMore
                    onToggleExpansion={() => {
                      LayoutAnimation.easeInEaseOut();
                      this.setState(state => {
                        if (!state.toggles[i]) {
                          state.toggles = state.toggles.map(t => false);
                        }
                        state.toggles[i] = !state.toggles[i];
                        return state;
                      });
                    }}
                  >
                    <Picker
                      style={{ alignSelf: "stretch" }}
                      selectedValue={r.percentage}
                      onValueChange={num => {
                        this._updateNumberForIndex(num, i);
                      }}
                    >
                      {this._oneHundred.map(num => (
                        <Picker.Item
                          key={num}
                          label={String(num)}
                          value={num}
                        />
                      ))}
                    </Picker>
                  </InputPicker>
                </View>
              );
            })}
          </InputGroup>

          <InputGroup style={{ backgroundColor: "white" }} mt={3}>
            <InputToggle
              label="Melange"
              value={this.props.roast.isMelange}
              onValueChange={v => {
                this.props.dispatch({
                  type: "ROAST_CHANGE_MELANGE",
                  isMelange: v
                });
              }}
            />
          </InputGroup>
          <InputHelpText>
            A melange is a coffee blend consisting of multiple beans roasted in
            separate stages.
          </InputHelpText>

          {this.props.roast.isMelange && this._renderMelange()}
        </ScrollView>
        <KeyboardAvoidingView method="height" />
      </Base>
    );
  }

  _updateNumberForIndex(num, i) {
    const clone = [...this.props.roast.beans];

    // auto adjust the other num
    if (this.props.roast.beans.length === 2) {
      var diff = 100 - num;
      var otherIndex = i === 1 ? 0 : 1;
      clone[otherIndex].percentage = diff;
    }

    clone[i].percentage = num;

    this.props.dispatch({
      type: "ROAST_CHANGE_BEANS",
      beans: clone
    });
  }

  _deleteRoast(i) {
    console.log("delete roast", i);
    this.props.dispatch({
      type: "QUEUE_ROAST_DELETE",
      roastId: this.props.roast.roasts[i]._id
    });
  }

  _editRoast(i) {
    console.log("edit roast", i);
    this.setState({ selectedRoastIndex: i, modal: true });
  }

  _renderMelange() {
    const slideoutView = i => [
      <TouchableHighlight
        underlayColor={"rgba(0,0,0,0.3)"}
        onPress={() => this._editRoast(i)}
        style={{
          justifyContent: "center",
          backgroundColor: config.colors.gray,
          padding: 16,
          width: 100
        }}
      >
        <View>
          <Text textAlign="center" color="black">
            Edit
          </Text>
        </View>
      </TouchableHighlight>,

      <TouchableHighlight
        underlayColor={"rgba(0,0,0,0.7)"}
        onPress={() => this._deleteRoast(i)}
        style={{
          justifyContent: "center",
          padding: 16,
          width: 100,
          backgroundColor: "red"
        }}
      >
        <View>
          <Text textAlign="center" color="white">
            Delete
          </Text>
        </View>
      </TouchableHighlight>
    ];

    return (
      <View>
        <InputGroup inset={16} mb={0} label="ROAST STAGES" mt={3}>
          {this.props.roast.roasts.map((queue, i) => {
            const name = queue.beans.map(b => b.name).join(", ");

            return (
              <SwipeableRow
                rightButtons={slideoutView(i)}
                key={name + i}
                bounceOnMount
                rightButtonWidth={100}
              >
                <TouchableHighlight
                  underlayColor={"#eee"}
                  style={{ backgroundColor: "white", padding: 16 }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text flex={1} small bold>
                      {name}
                    </Text>
                    {/* <Icon size={20} name='ios-arrow-forward' color='light' /> */}
                  </View>
                </TouchableHighlight>
              </SwipeableRow>
            );
          })}
          <AddRow
            label="Add roast stage"
            onPress={() => {
              this.setState({ modal: true });
            }}
          />
        </InputGroup>
        <InputHelpText mb={2}>
          Swipe left on a roast stage to edit or delete it.
        </InputHelpText>
      </View>
    );
  }
}

function getState(state) {
  return {
    roast: state.roast
  };
}

export default connect(getState)(Blend);
