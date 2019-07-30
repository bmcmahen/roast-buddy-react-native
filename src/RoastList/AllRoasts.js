import React from "react";
import { ListView } from "react-native";
import RoastRow from "./RoastRow";
import { Base, Text, Divider } from "../components";

class AllRoasts extends React.Component {
  constructor(props) {
    super(props);
    this._ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
  }

  _renderRow(roast, sId, i) {
    const { beans } = roast;
    const isBlend = beans.length > 1;
    const beanText = beans.map(b => b.name).join(", ");
    const name = isBlend ? roast.name : beanText;

    return (
      <RoastRow
        key={roast._id}
        roast={roast}
        onPress={() => {
          this.props.navigation.navigate("ViewRoast", {
            id: roast._id,
            title: name
          });
        }}
      />
    );
  }

  render() {
    const { roasts } = this.props;

    const filtered = this.props.filter(roasts);
    const ds = this._ds.cloneWithRows(filtered);

    // handle empty state
    if (roasts.length === 0) {
      return (
        <Base flex={1} p={2}>
          <Text light small>
            No roasts recorded.
          </Text>
        </Base>
      );
    }

    return (
      <ListView
        dataSource={ds}
        keyboardDismissMode="on-drag"
        enableEmptySections
        renderSeparator={(a, b) => <Divider inset={16} key={a + b} />}
        renderRow={this._renderRow.bind(this)}
        style={{ flex: 1, backgroundColor: "white" }}
      />
    );
  }
}

export default AllRoasts;
