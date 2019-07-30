// @flow

import React from "react";
import { connect } from "react-redux";
import shortid from "shortid";

import {
  TextInput,
  StyleSheet,
  Platform,
  Picker,
  TouchableOpacity,
  View
} from "react-native";
import _ from "lodash";
import regions from "./regions";
import countries from "i18n-iso-countries";
import AutoComplete from "./AutoComplete";
import { addCustomBean, editCustomBean } from "../actions/custom-beans";
import { hideRecorder } from "../actions/recorder";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  InputGroup,
  Base,
  Text,
  NavTouchableText,
  NavTouchableIcon,
  CloseIcon,
  NavBar
} from "../components";
import { SafeAreaView } from "react-navigation";

class EditBean extends React.Component {
  componentDidMount() {
    this._countries = countries.getNames("en");
    this._names = Object.keys(this._countries).map(key => this._countries[key]);

    this.setState({
      preloading: false,
      countries: this._names
    });
  }

  _filterData() {
    const { query } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return this.state.countries.filter(country => country.search(regex) >= 0);
  }

  constructor(props) {
    super(props);
    const fields = [
      "species",
      "about",
      "appearance",
      "varietal",
      "roast",
      "flavour"
    ];

    this._countries = countries.getNames("en");

    const state = {
      fields,
      query: "",
      countries: [],
      region: props.bean ? props.bean.region || "" : "",
      preloading: true,
      name: props.bean ? props.bean.name : "",
      settings: [
        { maxLength: 40, placeholder: "(arabica/robusta)" },
        { multiline: true, maxLength: 200, placeholder: "about the beans" },
        {
          maxLength: 40,
          placeholder: "general description of bean appearance"
        },
        { maxLength: 40, placeholder: "coffee subspecies" },
        {
          multiline: true,
          maxLength: 200,
          placeholder: "suggested roast instructions"
        },
        {
          multiline: true,
          maxLength: 200,
          placeholder: "general flavor profile"
        },
        { maxLength: 40 },
        { maxLength: 40 }
      ]
    };

    fields.forEach(field => {
      state[field] = "";
      if (props.editing && props.bean) {
        state[field] = props.bean[field] || "";
      }
    });

    this.state = state;
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Custom Bean",
      headerLeft: (
        <NavTouchableText onPress={() => navigation.pop()}>
          Cancel
        </NavTouchableText>
      ),
      headerRight: (
        <NavTouchableText onPress={() => navigation.getParam("save")()}>
          Save
        </NavTouchableText>
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      save: this._save.bind(this)
    });
  }

  render() {
    const { state } = this;
    const { editing, bean } = this.props;
    const title = bean ? bean.name : "New Bean";
    const disabled = !state.name;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            automaticallyAdjustContentInsets={false}
            style={{ flex: 1, padding: 0, margin: 0 }}
          >
            <InputGroup
              showBorder={Platform.OS === "ios"}
              showTopBorder={false}
            >
              <Base px={2} pt={2} pb={1}>
                <Text small bold style={styles.label}>
                  bean name (required)
                </Text>
                <TextInput
                  placeholder="brief name"
                  style={[styles.field]}
                  maxLength={40}
                  defaultValue={this.state.name}
                  value={this.state.name}
                  onChangeText={text => {
                    this.setState({ name: text });
                  }}
                />
              </Base>
              {!state.preloading && (
                <Base pb={2} style={{ zIndex: 600 }}>
                  <Base px={2} pt={2} justifyContent="space-between" row>
                    <Text bold small>
                      country of origin
                    </Text>
                    {Platform.OS === "ios" && (
                      <Text>
                        {this.state.region ? regions(this.state.region) : ""}
                      </Text>
                    )}
                  </Base>
                  {Platform.OS === "ios" ? (
                    <AutoComplete
                      data={state.query ? this._filterData() : []}
                      defaultValue={state.query}
                      autoCorrect={false}
                      autoCapitalize="none"
                      containerStyle={styles.autocompleteContainer}
                      placeholder="search for country of origin"
                      onChangeText={text => this.setState({ query: text })}
                      renderItem={data => (
                        <TouchableOpacity
                          key={data}
                          style={{
                            height: 50,
                            padding: 16,
                            justifyContent: "center"
                          }}
                          onPress={() => {
                            this._selectCountry(data);
                          }}
                        >
                          <View>
                            <Text>{data}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <View style={{ paddingHorizontal: 10 }}>
                      <Picker
                        selectedValue={this.state.region}
                        onValueChange={region => this.setState({ region })}
                      >
                        {Object.keys(this._countries).map(key => {
                          const name = this._countries[key];
                          return (
                            <Picker.Item key={key} label={name} value={key} />
                          );
                        })}
                      </Picker>
                    </View>
                  )}
                </Base>
              )}
              {state.fields.map((field, i) => (
                <Base key={field} px={2} pt={2} pb={1}>
                  <Text small bold style={styles.label}>
                    {field}
                  </Text>
                  <TextInput
                    key={field}
                    placeholder="Enter text here..."
                    style={[
                      styles.field,
                      state.settings[i].multiline && styles.multiline
                    ]}
                    defaultValue={state[field]}
                    value={state[field]}
                    {...state.settings[i]}
                    onChangeText={text => {
                      this.setState({ [field]: text });
                    }}
                  />
                </Base>
              ))}
            </InputGroup>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    );
  }

  _selectCountry(name) {
    const code = countries.getAlpha2Code(name, "en");
    this.setState({ region: code, query: "" });
  }

  _save() {
    const bean = _.pick(this.state, [
      "name",
      "region",
      "about",
      "species",
      "appearance",
      "varietal",
      "roast",
      "flavour"
    ]);

    const withoutNull = _.omit(bean, _.isEmpty);

    if (this.props.editing) {
      this.props.dispatch(editCustomBean(this.props.bean._id, withoutNull));
    } else {
      this.props.dispatch(
        addCustomBean(Object.assign(withoutNull, { _id: shortid.generate() }))
      );
    }

    this.props.navigation.goBack();
  }

  // possibly warn
  _close() {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  field: {
    ...Platform.select({
      ios: {
        height: 35,
        fontSize: 17
      },
      android: {
        height: 45,
        fontSize: 17
      }
    }),
    color: "#666"
  },
  multiline: {
    height: 75,
    fontSize: 17,
    textAlignVertical: "top"
  },
  label: {
    ...Platform.select({
      android: {
        paddingLeft: 4
      }
    })
  },
  autocompleteContainer: {
    // flex: 1,
    // left: 0,
    // zIndex: 500,
    // backgroundColor: 'white',
    // position: 'absolute',
    // right: 0,
    // top: 20
  }
});

function getState(state, props) {
  const beanId = props.navigation.getParam("beanId");

  if (beanId) {
    return {
      bean: _.find(state.customBeans, b => b._id === beanId),
      editing: true
    };
  }

  return {
    editing: false
  };
}

export default connect(getState)(EditBean);
