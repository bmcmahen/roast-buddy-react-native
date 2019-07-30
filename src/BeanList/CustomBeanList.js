import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { View, RefreshControl, StyleSheet, SectionList } from "react-native";
import { Divider, Text, Icon, TouchableRow } from "../components";
import { fetchBeans } from "../actions/beans";
import { push } from "../actions/nav";
import { showNewBean } from "../actions/recorder";

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

    console.log(sorted, this.getData(sorted));

    return (
      <SectionList
        renderItem={this._renderRow}
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
        <TouchableRow
          height={50}
          showMore={false}
          onPress={() => {
            this.props.dispatch(showNewBean());
          }}
          primaryText={
            <Text color="red" small bold>
              Add Custom Bean
            </Text>
          }
          value={<Icon name="plus" color="red" mr={2} />}
        />
        <Divider inset={0} />
        <Divider inset={0} style={{ marginTop: 3 }} />
      </View>
    );
  };

  _renderRow = ({ item: bean }) => {
    return (
      <TouchableRow
        onPress={() => {
          this.props.dispatch(
            push("Bean View", {
              beanId: bean._id,
              isCustom: true,
              title: bean.name
            })
          );
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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#F6F6F6"
  },
  thumb: {
    width: 64,
    height: 64
  },
  text: {
    flex: 1
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  }
});

function getState(state) {
  return {
    beans: state.customBeans
  };
}

export default connect(getState)(List);
