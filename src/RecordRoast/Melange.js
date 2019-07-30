import React from "react";
import { View, TouchableHighlight, StyleSheet } from "react-native";
import shortid from "shortid";
import { connect } from "react-redux";
import {
  TouchableInput,
  InputGroup,
  Text,
  Base,
  CheckMark
} from "../components";
import moment from "moment";

class Melange extends React.Component {
  constructor(props) {
    super(props);
    const { selectedRoast } = props;

    const beans = props.roast.beans.map(bean =>
      Object.assign({}, bean, {
        selected: selectedRoast
          ? selectedRoast.beans.some(b => b._id === bean._id)
          : false
      })
    );

    this.state = {
      beans
    };
  }

  componentWillReceiveProps(nextProps) {
    const beans = nextProps.roast.beans.map(bean =>
      Object.assign({}, bean, { selected: false })
    );
    this.setState({ beans });
  }

  render() {
    const hasBean = this.state.beans.some(b => b.selected);

    return (
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          flex: 1,
          justifyContent: "center",
          padding: 16
        }}
      >
        <Text textAlign="center" mb={2} color="white" large thin>
          Select Beans
        </Text>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            overflow: "hidden"
          }}
        >
          <InputGroup>
            {this.state.beans.map((b, i) => this._renderBean(b, i))}
            <Base row>
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.15)"}
                onPress={() => {
                  this.props.onRequestClose();
                }}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRightColor: "rgba(0,0,0,0.15)",
                  borderRightWidth: StyleSheet.hairlineWidth
                }}
              >
                <View>
                  <Text textAlign="center">Cancel</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.15)"}
                onPress={this._save.bind(this)}
                disabled={!hasBean}
                style={{ flex: 1, padding: 16 }}
              >
                <View>
                  <Text textAlign="center" bold color="blue">
                    Save
                  </Text>
                </View>
              </TouchableHighlight>
            </Base>
          </InputGroup>
        </View>
      </View>
    );
  }

  _edit(selected) {
    this.props.dispatch({
      type: "QUEUE_ROAST_EDIT",
      roastId: this.props.selectedRoast._id,
      roast: {
        beans: selected
      }
    });

    this.props.onRequestClose();
  }

  _save() {
    const selected = this.state.beans
      .filter(b => b.selected)
      .map(b => {
        delete b.selected;
        return b;
      });

    if (this.props.selectedRoast && selected.length === 0) {
      return this.props.onRequestDelete();
    }

    if (selected.length === 0) {
      return this.props.onRequestClose();
    }

    if (this.props.selectedRoast) {
      return this._edit(selected);
    }

    this.props.dispatch({
      type: "QUEUE_ROAST_ADD",
      roast: {
        _id: shortid.generate(),
        name: "",
        beans: selected,
        date: moment.utc().format(),
        other: [],
        cracks: []
      }
    });

    this.props.onRequestClose();
  }

  _renderBean(bean, i) {
    return (
      <TouchableInput
        key={bean._id}
        height={60}
        value={<CheckMark isChecked={bean.selected} mr={2} />}
        onPress={() => {
          this._toggleBean(i);
        }}
        label={bean.name}
      />
    );
  }

  _toggleBean(i) {
    this.setState(state => {
      state.beans[i].selected = !state.beans[i].selected;
      return state;
    });
  }
}

function getState(state) {
  return {
    roast: state.roast
  };
}

export default connect(getState)(Melange);
