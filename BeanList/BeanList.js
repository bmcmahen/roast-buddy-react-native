import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { FlatList } from "react-native";
import { Divider, Text, TouchableRow } from "../components";
import { fetchBeans } from "../actions/beans";
import { push } from "../actions/nav";

class List extends React.Component {
  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
    this._reload = this._reload.bind(this);
  }

  render() {
    const { beans } = this.props;
    const { status } = beans;
    const loading = status === "sync";

    return (
      <FlatList
        data={this.props.beans.beans}
        renderItem={this._renderRow}
        keyExtractor={item => item._id}
        renderSeparator={(a, b) => <Divider inset={16} key={a + b} />}
        onRefresh={this._reload}
        keyboardShouldPersistTaps="always"
        refreshing={loading}
      />
    );
  }

  _renderRow({ item: bean }) {
    return (
      <TouchableRow
        key={bean._id}
        onPress={() => {
          this.props.dispatch(
            push("Bean View", { beanId: bean._id, title: bean.name })
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
  }

  _reload() {
    this.props.dispatch(fetchBeans());
  }
}

function getState(state) {
  return {
    beans: state.beans
  };
}

export default connect(getState)(List);
