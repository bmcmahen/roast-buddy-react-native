//@flow
import _ from "lodash";
import React from "react";
import fuzzy from "fuzzy";
import { ListView, TouchableHighlight, View } from "react-native";

import { Base, Text, Icon, Divider } from "../components";

export default class Beans extends React.Component {
  constructor(props) {
    super(props);
    this._onSearch = _.debounce(this._onSearch.bind(this), 200);
    this._ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    const beans = this._getBeans(props.roasts);

    this.state = {
      searchList: this._generateSearchText(beans),
      beans,
      results: Object.keys(beans).sort()
    };
  }

  _getBeans(roasts) {
    return _.groupBy(roasts, r => r.beans[0].name);
  }

  _generateSearchText(groups) {
    return Object.keys(groups);
  }

  _renderRow(name, sId, i) {
    return (
      <TouchableHighlight
        underlayColor={"rgba(0,0,0,0.1)"}
        onPress={() => {
          this.props.dispatch({
            type: "PUSH",
            route: {
              key: "List Bean Roasts",
              beanName: name
            }
          });
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 16,
            height: 50,
            paddingVertical: 0,
            paddingLeft: 16
          }}
        >
          {/* <View style={{ alignSelf: 'center', marginRight: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: color }} /> */}
          <Base flex={1} style={{ paddingVertical: 10 }}>
            <Text numberOfLines={1} small bold>
              {name}
            </Text>
          </Base>
          <Text mr={2} small light>
            {this.state.beans[name].length}
          </Text>
          <Icon
            name="chevron-right"
            alignSelf="center"
            size={15}
            color="light"
          />
        </View>
      </TouchableHighlight>
    );
  }

  componentWillReceiveProps(nextProps) {
    const beans = this._getBeans(nextProps.roasts);

    this.setState({
      beans,
      searchList: this._generateSearchText(beans)
    });

    if (nextProps.search !== this.props.search) {
      if (!nextProps.search) {
        this.setState({ results: Object.keys(this.state.beans).sort() });
      }
      this._onSearch(nextProps.search);
    }
  }

  _onSearch(term) {
    if (!this.props.search) {
      return;
    }

    const results = fuzzy.filter(term, this.state.searchList);
    const matches = results.map(el => {
      return el.string;
    });

    this.setState({ results: matches.sort() });
  }

  render() {
    const { beans, results } = this.state;

    const ds = this._ds.cloneWithRows(results);

    if (Object.keys(beans).length === 0) {
      return (
        <Base flex={1} p={2}>
          <Text light small>
            No beans listed.
          </Text>
        </Base>
      );
    }

    return (
      <ListView
        dataSource={ds}
        enableEmptySections
        keyboardDismissMode="on-drag"
        renderSeparator={(a, b) => <Divider inset={16} key={a + b} />}
        renderRow={this._renderRow.bind(this)}
        style={{ flex: 1, backgroundColor: "white" }}
      />
    );
  }
}
