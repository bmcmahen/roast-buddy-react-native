import React from "react";
import {
  InputGroup,
  InputTouchable,
  CheckMark,
  Text,
  Base
} from "../components";
import { View, ScrollView } from "react-native";
import { DEGREES } from "../data";
import { connect } from "react-redux";

class Degrees extends React.Component {
  render() {
    const { roast, index } = this.props;

    const r = roast.roasts[index];

    return (
      <Base
        flex={1}
        justifyContent="center"
        backgroundColor="rgba(0,0,0,0.8)"
        rounded
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          style={{ flex: 1, padding: 16 }}
        >
          <InputGroup showBorder={false}>
            {DEGREES.map((deg, i) => {
              const selected =
                typeof r.degree !== "undefined" && i === r.degree;
              return (
                <InputTouchable
                  height={75}
                  backgroundColor={deg.color}
                  key={deg.label}
                  icon={<CheckMark isChecked={selected} mr={2} />}
                  onPress={() => {
                    const change = {
                      degree: i
                    };

                    this.props.roast.roasts[index] = {
                      ...this.props.roast.roasts[index],
                      ...change
                    };

                    this.props.dispatch({
                      type: "ROAST_CHANGE",
                      roasts: this.props.roast.roasts
                    });

                    this.props.onRequestClose();
                  }}
                  inverted
                  label={
                    <View>
                      <Text small bold inverted>
                        {deg.label}
                      </Text>
                      <Text
                        numberOfLines={2}
                        small
                        pr={2}
                        color="rgba(255,255,255,0.8)"
                      >
                        {deg.description || "description"}
                      </Text>
                    </View>
                  }
                />
              );
            })}
          </InputGroup>
        </ScrollView>
      </Base>
    );
  }
}

function getState(state) {
  return {
    roast: state.roast
  };
}

export default connect(getState)(Degrees);
