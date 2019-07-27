// @flow
import React from "react";
import {
  View,
  TouchableHighlight,
  Animated,
  ListView,
  Alert,
  TextInput,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import shortid from "shortid";
import {
  Text,
  TouchableRow,
  Divider,
  Icon,
  InputGroup,
  TouchableRowCell,
  Base,
  NavTouchableText
} from "../components";
import fuzzy from "fuzzy";
import _ from "lodash";
import { addCustomBean } from "../actions/custom-beans";

class Bean extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mount: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.spring(this.state.mount, {
      toValue: 1
    }).start();
  }

  render() {
    const { bean, onPress } = this.props;

    const scale = this.state.mount.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1]
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity: this.state.mount,
          height: 35,
          marginRight: 6,
          marginTop: 6
        }}
      >
        <TouchableHighlight
          key={bean._id}
          underlayColor={"rgba(0,0,0,0.7)"}
          style={{
            backgroundColor: "#08e",
            paddingHorizontal: 16,
            height: 35,
            borderRadius: 25,
            justifyContent: "center"
          }}
          onPress={onPress}
        >
          <View>
            <Text small color="white">
              {bean.name}
              <Text style={{ color: "white" }}>&nbsp;&times;</Text>
            </Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
}

class SelectBeans extends React.Component {
  constructor(props) {
    super(props);

    this._onSearch = _.debounce(this._onSearch.bind(this), 300);
    this._ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.name !== r2.name
    });

    const fetchedBeans = props.beans.beans;
    this._list = this._generateSearchText(fetchedBeans, props.customBeans);
    const beanList = this._generateBeanList(fetchedBeans, props.customBeans);

    this.state = {
      search: "",
      results: beanList,
      beanList
    };
  }

  static navigationOptions = ({ navigation }) => {
    const beans = navigation.getParam("beans") || 0;
    return {
      title: "Select Beans",
      headerLeft: (
        <NavTouchableText
          onPress={() => {
            navigation.navigate("Root");
          }}
        >
          Cancel
        </NavTouchableText>
      ),
      headerRight: (
        <NavTouchableText
          disabled={!beans}
          onPress={() => {
            navigation.navigate(beans > 1 ? "Blend" : "Recorder");
          }}
        >
          Next
        </NavTouchableText>
      )
    };
  };

  _generateSearchText(defaultBeans, customBeans) {
    const def = defaultBeans.map(b => b.name);
    const custom = customBeans.map(b => b.name);
    return [...def, ...custom].sort();
  }

  _generateBeanList(defaultBeans, customBeans) {
    return _.sortBy([...defaultBeans, ...customBeans], "name");
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.customBeans.length !== this.props.customBeans.length ||
      nextProps.beans.beans !== this.props.beans.beans
    ) {
      this._list = this._generateSearchText(
        nextProps.beans.beans,
        nextProps.customBeans
      );

      this.setState(
        {
          beanList: this._generateBeanList(
            nextProps.beans.beans,
            nextProps.customBeans
          )
        },
        () => {
          this._onSearch(this.state.search);
        }
      );
    }
  }

  _addBeans(bean) {
    // support at most 8 beans. honestly, who
    // would do more than this?
    if (this.props.roast.beans.length > 8) {
      return;
    }

    // prevent duplicates
    const hasIt = this.props.roast.beans.some(b => {
      return b._id === bean._id;
    });

    if (hasIt) return;

    // LayoutAnimation.spring()
    const beans = [...this.props.roast.beans, bean];
    this.props.dispatch({
      type: "ROAST_CHANGE_BEANS",
      beans
    });

    this.props.navigation.setParams({ beans: beans.length });
  }

  _removeBean(i) {
    // LayoutAnimation.spring()
    this.props.roast.beans.splice(i, 1);
    this.props.dispatch({
      type: "ROAST_CHANGE_BEANS",
      beans: this.props.roast.beans
    });

    this.props.navigation.setParams({ beans: this.props.roast.beans.length });
  }

  _addCustomBeans(bean) {
    let exists = this.props.customBeans.some(
      b => b.name.toLowerCase() === bean.name.toLowerCase()
    );
    if (exists) {
      Alert.alert("A custom bean with this name already exists.");
      return;
    }

    const { beans } = this.props.beans;
    let defaultExists = beans.some(
      b => b.name.toLowerCase() === bean.name.toLowerCase()
    );
    if (defaultExists) {
      Alert.alert(
        "A bean with this name already exists.",
        "Please select it instead."
      );
      return;
    }

    this.props.dispatch(addCustomBean(bean));

    this.setState({ search: "" });
    this._showAll();

    this._addBeans(bean);
  }

  _showAll() {
    this.setState({ results: this.state.beanList });
  }

  _onSearch(v) {
    if (!this.state.search) {
      return;
    }

    const results = fuzzy.filter(v, this._list);
    const matches = results.map(el => {
      return this.state.beanList[el.index];
    });

    this.setState({ results: matches });
  }

  _renderBean(bean, i) {
    return (
      <Bean
        bean={bean}
        key={bean._id || bean.id}
        onPress={() => {
          this._removeBean(i);
        }}
      />
    );
  }

  render() {
    const { results, search } = this.state;

    const { roast } = this.props;

    const { beans } = roast;
    const ds = this._ds.cloneWithRows(results);

    return (
      <Base flex={1}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 0,
            paddingBottom: 0,
            flexDirection: "row",
            backgroundColor: "#fafafa",
            flexWrap: "wrap"
          }}
        >
          {beans.map(this._renderBean.bind(this))}
        </View>
        <InputGroup showTopBorder={false}>
          <TextInput
            style={{
              height: 50,
              padding: 16,
              fontSize: 16,
              backgroundColor: "#fafafa"
            }}
            maxLength={35}
            autoCapitalize="words"
            value={this.state.search}
            placeholder="Enter bean type"
            onChangeText={v => {
              if (!v) this._showAll();
              else this._onSearch(v);
              this.setState({ search: v });
            }}
          />
        </InputGroup>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ListView
            dataSource={ds}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            removeClippedSubviews={false}
            enableEmptySections
            renderHeader={() => {
              if (!search.trim()) return null;

              return (
                <View style={{ backgroundColor: "white" }}>
                  <TouchableRowCell
                    showMore={false}
                    backgroundColor="white"
                    style={{
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: "rgba(0,0,0,0.15)",
                      paddingRight: 16
                    }}
                    onPress={() => {
                      this._addCustomBeans({
                        name: search.trim(),
                        _id: shortid.generate()
                      });
                    }}
                    height={70}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignSelf: "stretch",
                        flex: 1
                      }}
                    >
                      <Text small light>
                        custom bean
                      </Text>
                      <Text mt={1}>{search.trim()}</Text>
                    </View>
                    <Base>
                      <Icon name="plus" color="light" />
                    </Base>
                  </TouchableRowCell>
                  <Divider style={{ marginTop: 2 }} />
                </View>
              );
            }}
            renderSeparator={(a, b) => <Divider inset={16} key={a + "-" + b} />}
            renderRow={this._renderRow.bind(this)}
            style={{ flex: 1, backgroundColor: "white" }}
          />
        </View>
      </Base>
    );
  }

  _renderRow(bean, sId, i) {
    return (
      <TouchableRow
        style={{
          overflow: "hidden",
          backgroundColor: "white",
          paddingRight: 16
        }}
        onPress={() => {
          this._addBeans(bean);
          this.setState({ search: "" });
          this._showAll();
        }}
        height={50}
        key={bean._id}
        value={<Icon name="plus" mr={2} color="light" />}
        primaryText={
          <Text small bold>
            {bean.name}
          </Text>
        }
        showMore={false}
      />
    );
  }
}

function getState(state) {
  return {
    roast: state.roast,
    customBeans: state.customBeans,
    beans: state.beans
  };
}

export default connect(getState)(SelectBeans);
