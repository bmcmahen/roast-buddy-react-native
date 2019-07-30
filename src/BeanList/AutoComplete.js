import React, { Component, PropTypes } from "react";
import {
  ListView,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  View
} from "react-native";

class AutoComplete extends Component {
  static defaultProps = {
    data: [],
    defaultValue: "",
    renderItem: rowData => <Text>{rowData}</Text>
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.data),
      showResults: props.data && props.data.length > 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const dataSource = this.state.dataSource.cloneWithRows(nextProps.data);
    this._showResults(dataSource.getRowCount() > 0);
    this.setState({ dataSource });
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur() {
    const { textInput } = this;
    textInput && textInput.blur();
  }

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus() {
    const { textInput } = this;
    textInput && textInput.focus();
  }

  _renderItems() {
    const { listStyle, renderItem } = this.props;
    const { dataSource } = this.state;
    return (
      <ListView
        dataSource={dataSource}
        keyboardShouldPersistTaps="always"
        renderRow={renderItem}
        style={[styles.list, listStyle]}
      />
    );
  }

  _showResults(show) {
    const { showResults } = this.state;
    const { onShowResults } = this.props;

    if (!showResults && show) {
      this.setState({ showResults: true });
      onShowResults && onShowResults(true);
    } else if (showResults && !show) {
      this.setState({ showResults: false });
      onShowResults && onShowResults(false);
    }
  }

  render() {
    const { showResults } = this.state;
    const {
      containerStyle,
      inputContainerStyle,
      onEndEditing,
      style,
      ...props
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          <TextInput
            style={[styles.input, style]}
            ref={ref => (this.textInput = ref)}
            {...props}
          />
        </View>
        {showResults && this._renderItems()}
      </View>
    );
  }
}

const border = {
  borderColor: "#b9b9b9",
  borderRadius: 1,
  borderWidth: 1
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.15)",
    margin: 10,
    marginLeft: 13,
    marginBottom: 0
    // paddingTop: 5
  },
  input: {
    backgroundColor: "white",
    height: 40,
    paddingLeft: 3,
    ...Platform.select({
      android: {
        fontSize: 17
      }
    })
  },
  list: {
    ...border,
    backgroundColor: "white",
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0
  }
});

export default AutoComplete;
