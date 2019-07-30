import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { View, SectionList, StyleSheet } from "react-native";
import {
  Divider,
  Text,
  Icon,
  Base,
  TouchableRow,
  TouchableRowCell
} from "../components";
import { fetchBeans } from "../actions/beans";

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  getData(sorted) {
    const dataBlob = {};
    const sectionIds = ["Section 0"];
    const rowIDs = [[]];
    dataBlob["Section 0"] = {};
    sorted.forEach((item, i) => {
      dataBlob[sectionIds[0]]["Row " + i] = item;
      rowIDs[0].push("Row " + i);
    });
    return [dataBlob, sectionIds, rowIDs];
  }

  render() {
    const { beans } = this.props;
    const { status } = beans;

    const loading = status === "sync";
    // const error = status === "sync-error"

    const sorted = _.sortBy(beans, "name");

    return (
      <SectionList
        renderItem={this._renderRow}
        keyExtractor={a => a._id}
        renderSectionHeader={this._renderHeader}
        renderSeparator={(a, b) => <Divider inset={16} key={a + b} />}
        onRefresh={this._reload}
        refreshing={loading}
        sections={[
          {
            data: beans,
            key: 1
          }
        ]}
      />
    );
  }

  _renderHeader = () => {
    return (
      <View>
        <TouchableRowCell
          showMore={false}
          backgroundColor="white"
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "rgba(0,0,0,0.15)",
            paddingRight: 16
          }}
          onPress={() => {
            this.props.navigation.navigate("Bean");
          }}
          height={64}
        >
          <View
            style={{
              justifyContent: "center",
              alignSelf: "stretch",
              flex: 1
            }}
          >
            <Text>Add a custom bean</Text>
          </View>
          <Base>
            <Icon name="plus" color="light" />
          </Base>
        </TouchableRowCell>

        <Divider style={{ marginTop: 2 }} />
      </View>
    );
  };

  _renderRow = ({ item: bean }) => {
    return (
      <TouchableRow
        onPress={() => {
          this.props.navigation.navigate("ViewBean", {
            beanId: bean._id,
            isCustom: true,
            title: bean.name
          });
        }}
        height={50}
        key={bean._id}
        primaryText={
          <Text small bold>
            {bean.name}
          </Text>
        }
        showMore
      />
    );
  };

  _reload() {
    this.props.dispatch(fetchBeans());
  }
}

function getState(state) {
  return {
    beans: state.customBeans
  };
}

export default connect(getState)(List);
