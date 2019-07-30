import React from "react";
import { Picker, StyleSheet, Modal, View } from "react-native";
import _ from "lodash";
import { Base, Text, TouchableInput, Button } from "../components";

const minuteRange = _.range(60);

export class RoastDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false
    };
  }

  render() {
    const { value, onValueChange, onRequestRemove } = this.props;

    let minutes = Math.floor((value / 60) % 60);
    let seconds = Math.floor(value - minutes * 60);

    seconds = seconds || 0;
    minutes = minutes || 0;

    const valueText = (
      <Text mr={2} alignSelf="flex-end">
        {minutes || seconds
          ? (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds)
          : ""}
      </Text>
    );

    return (
      <Base backgroundColor="white">
        <TouchableInput
          label="Duration (m:s)"
          backgroundColor="white"
          showMore
          value={valueText}
          onPress={() => {
            this.setState({ showing: true });
          }}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showing}
          onRequestClose={() => {
            this.setState({ showing: false });
          }}
        >
          <Base
            flex={1}
            justifyContent="flex-end"
            backgroundColor="transparent"
          >
            <Base
              justifyContent="space-between"
              row
              backgroundColor="#f0f1f3"
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: "#aaa"
              }}
              p={2}
              py={1}
            >
              <Button
                small
                transparent
                onPress={() => {
                  onRequestRemove();
                }}
              >
                Remove
              </Button>
              <Button
                small
                primary
                onPress={() => {
                  this.setState({ showing: false });
                }}
              >
                Done
              </Button>
            </Base>
            <Base row backgroundColor="#d1d4db">
              <Picker
                style={{ flex: 1 }}
                selectedValue={minutes}
                prompt="Select minutes"
                onValueChange={m => {
                  onValueChange(m * 60 + seconds);
                }}
              >
                {minuteRange.map(opt => (
                  <Picker.Item key={opt} label={opt.toString()} value={opt} />
                ))}
              </Picker>
              <Picker
                style={{ flex: 1 }}
                selectedValue={seconds}
                prompt="Select seconds"
                onValueChange={v => {
                  onValueChange(minutes * 60 + v);
                }}
              >
                {minuteRange.map(opt => (
                  <Picker.Item key={opt} label={opt.toString()} value={opt} />
                ))}
              </Picker>
            </Base>
          </Base>
        </Modal>
      </Base>
    );
  }
}

const weightOptions = _.range(1000);

export class RoastTemperature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false
    };
  }

  render() {
    const { value, onValueChange, onRequestRemove } = this.props;

    const valueText = (
      <Text mr={2} alignSelf="flex-end">
        {typeof value !== "undefined" ? value + "°C" : ""}
      </Text>
    );

    return (
      <Base backgroundColor="white">
        <TouchableInput
          label="Temperature (celcius)"
          backgroundColor="white"
          showMore
          value={valueText}
          onPress={() => {
            this.setState({ showing: true });
          }}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showing}
          onRequestClose={() => {
            this.setState({ showing: false });
          }}
        >
          <Base
            flex={1}
            justifyContent="flex-end"
            backgroundColor="transparent"
          >
            <Base
              justifyContent="space-between"
              row
              backgroundColor="#f0f1f3"
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: "#aaa"
              }}
              p={2}
              py={1}
            >
              <Button
                small
                transparent
                onPress={() => {
                  onRequestRemove();
                }}
              >
                Remove
              </Button>
              <Button
                small
                primary
                onPress={() => {
                  this.setState({ showing: false });
                }}
              >
                Done
              </Button>
            </Base>
            <Base backgroundColor="#d1d4db">
              <Picker
                prompt="Select roast temperature (celcius)"
                selectedValue={value}
                onValueChange={onValueChange}
              >
                {weightOptions.map(opt => (
                  <Picker.Item key={opt} label={opt.toString()} value={opt} />
                ))}
              </Picker>
            </Base>
          </Base>
        </Modal>
      </Base>
    );
  }
}

/**
 * Roast Weight
 */

export class RoastWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false
    };
  }

  render() {
    const { value, onValueChange, onRequestRemove } = this.props;

    const valueText = (
      <Text mr={2} alignSelf="flex-end">
        {typeof value !== "undefined" ? value + " g" : ""}
      </Text>
    );

    return (
      <Base backgroundColor="white">
        <View>
          <TouchableInput
            label="Weight (grams)"
            backgroundColor="white"
            showMore
            value={valueText}
            onPress={() => {
              this.setState({ showing: true });
            }}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showing}
          onRequestClose={() => {
            this.setState({ showing: false });
          }}
        >
          <Base
            flex={1}
            justifyContent="flex-end"
            backgroundColor="transparent"
          >
            <Base
              justifyContent="space-between"
              row
              backgroundColor="#f0f1f3"
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: "#aaa"
              }}
              p={2}
              py={1}
            >
              <Button
                small
                transparent
                onPress={() => {
                  onRequestRemove();
                }}
              >
                Remove
              </Button>
              <Button
                small
                primary
                onPress={() => {
                  this.setState({ showing: false });
                }}
              >
                Done
              </Button>
            </Base>
            <Base backgroundColor="#d1d4db">
              <Picker
                prompt="Select roast weight (grams)"
                selectedValue={value}
                onValueChange={onValueChange}
              >
                {weightOptions.map(opt => (
                  <Picker.Item key={opt} label={opt.toString()} value={opt} />
                ))}
              </Picker>
            </Base>
          </Base>
        </Modal>
      </Base>
    );
  }
}

//
// export const RoastWeight = (
//   props
// ) => {
//
//   const {
//     value,
//     onValueChange,
//     onRequestRemove
//   } = props
//
//   const valueText = <Text mr={2} alignSelf='flex-end'>
//     {typeof value !== 'undefined' ? value + ' g' : ''}
//   </Text>
//
//   return (
//     <Base backgroundColor='white'>
//       <View>
//         <InputRow
//           removable
//           backgroundColor='white'
//           onRequestRemove={onRequestRemove}
//           editable={false}
//           label='Weight (grams)'
//           onChangeText={noop}
//           value={valueText}
//         />
//       </View>
//       <Base px={Platform.OS === 'android' ? 2 : 0}>
//         <Picker
//           prompt='Select roast weight (grams)'
//           selectedValue={value}
//           onValueChange={onValueChange}
//         >
//           {weightOptions.map(opt => (
//             <Picker.Item key={opt} label={opt.toString()} value={opt} />
//           ))}
//         </Picker>
//       </Base>
//     </Base>
//   )
// }
