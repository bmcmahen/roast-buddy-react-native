import { connect } from "react-redux";
import React from "react";
import _ from "lodash";
import { View, Animated, Dimensions, InteractionManager } from "react-native";
import { Text, Base } from "../components";
import regions from "../BeanList/regions";

class Region extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(20)
    };
  }

  componentDidMount() {
    this._updateWidth();
  }

  componentWillReceiveProps(nextProps) {
    this._updateWidth();
  }

  _updateWidth() {
    const screen = Dimensions.get("window");

    const { name, count, maxCount, i } = this.props;

    const percent = count / maxCount;
    const width = (screen.width - 50) * percent;
    Animated.sequence([
      Animated.delay(i * 50),
      Animated.spring(this.state.width, { toValue: width })
    ]).start();
  }

  render() {
    const screen = Dimensions.get("window");

    const { name, count, maxCount } = this.props;

    const { width } = this.state;

    const percent = count / maxCount;
    const w = (screen.width - 50) * percent;

    return (
      <Base mt={0}>
        <Base row alignItems="center" style={{ position: "relative" }}>
          <Animated.View
            style={{
              height: 30,
              marginTop: 5,
              borderRadius: 15,
              width,
              backgroundColor: "black"
            }}
          />
          <Text ml={1} tiny bold light>
            {count}
          </Text>
        </Base>
        <Text
          numberOfLines={1}
          width={w}
          style={{
            left: 13,
            top: 13,
            backgroundColor: "transparent",
            position: "absolute"
          }}
          tiny
          textAlign="left"
          pr={2}
          color="white"
          bold
          ml={0}
        >
          {regions(name)}
        </Text>
      </Base>
    );
  }
}

class RoastsByRegion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreview: false
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ showPreview: false });
    });
  }

  render() {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text mb={2} ml={1} bold small mt={2}>
          Which regions are your coffees from?
        </Text>
        {this.state.showPreview ? <View /> : this._renderRegions()}
      </View>
    );
  }

  _renderRegions() {
    const { roasts } = this.props;

    const regions = generateRegions(roasts, 10, this.props.beansById);
    let max = 0;
    regions.forEach(region => {
      if (region.count > max) {
        max = region.count;
      }
    });

    return (
      <View>
        {regions.length === 0 ? (
          <Base px={1}>
            <Text small light>
              No roasts with regions have been added.
            </Text>
          </Base>
        ) : (
          regions.map(this._renderRegion.bind(this, max))
        )}
      </View>
    );
  }

  _renderRegion(max, region, i) {
    return (
      <Region
        key={region.key}
        name={region.key}
        count={region.count}
        maxCount={max}
      />
    );
  }
}

function generateRegions(roasts, limit, allBeans) {
  const regions = {};
  roasts.forEach(roast => {
    if (roast.roasts.length > 1) return;
    const { beans } = roast;
    beans.forEach(bean => {
      const beanInfo = allBeans[bean._id];
      if (beanInfo && beanInfo.region) {
        regions[beanInfo.region] = regions[beanInfo.region]
          ? regions[beanInfo.region] + 1
          : 1;
      }
    });
  });

  const byArray = [];
  Object.keys(regions).forEach(key => {
    const count = regions[key];
    byArray.push({ key, count });
  });

  const sorted = _.orderBy(byArray, "count", "desc");
  return sorted.slice(0, 10);
}

function getState(state, props) {
  return {
    roasts: state.coffees.items,
    beansById: state.beans.beansById
  };
}

export default connect(getState)(RoastsByRegion);
