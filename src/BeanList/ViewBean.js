import React from "react";
import { ScrollView, Alert } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { Text, InputGroup, Base, InputTouchable } from "../components";
import regions from "./regions";
import { deleteCustomBean } from "../actions/custom-beans";
import { pop } from "../actions/nav";
import { showEditBean } from "../actions/recorder";

class ViewBean extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (!nextProps.bean) return false;
    return true;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  render() {
    const { bean, isCustom } = this.props;
    const possibleFields = [
      "region",
      "species",
      "about",
      "appearance",
      "varietal",
      "roast",
      "flavour",
      "balance",
      "complexity"
    ];

    return (
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <InputGroup>
          {possibleFields.map(field => {
            if (bean[field]) {
              let val = bean[field];
              if (field === "region") {
                val = regions(bean[field]);
              }

              return (
                <Base p={2}>
                  <Text bold small>
                    {field}
                  </Text>
                  <Text mt={2} small light>
                    {val}
                  </Text>
                </Base>
              );
            }
          })}
        </InputGroup>

        {isCustom && (
          <InputGroup mt={3}>
            <InputTouchable
              label="Edit Bean"
              showMore
              onPress={() => {
                this.props.dispatch(showEditBean(this.props.bean._id));
              }}
            />
            <InputTouchable
              label="Delete"
              showMore
              textColor="red"
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to delete this bean?",
                  "This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel", onPress: () => {} },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: this._delete.bind(this)
                    }
                  ]
                );
              }}
            />
          </InputGroup>
        )}
      </ScrollView>
    );
  }

  _delete() {
    this.props.dispatch(deleteCustomBean(this.props.bean._id));
    this.props.navigation.goBack();
  }
}

function getState(state, props) {
  const beanId = props.navigation.getParam("beanId");
  const isCustom = props.navigation.getParam("isCustom");

  if (isCustom) {
    return {
      bean: _.find(state.customBeans, b => b._id === beanId)
    };
  }

  return {
    bean: _.find(state.beans.beans, b => b._id === beanId)
  };
}
export default connect(getState)(ViewBean);
