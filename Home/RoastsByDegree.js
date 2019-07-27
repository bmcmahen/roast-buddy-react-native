import { connect } from "react-redux";
import React from "react";
import _ from "lodash";
import { View, Animated, Dimensions, LayoutAnimation } from "react-native";
import { Text, Base } from "../components";
import { DEGREES } from "../data";

class Deg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(75)
    };
  }

  componentDidMount() {
    this._updateWidth();
    hasRendered = true;
  }

  componentWillReceiveProps(nextProps) {
    this._updateWidth();
  }

  _updateWidth() {
    const { degree, count, maxCount, i } = this.props;

    const screen = Dimensions.get("window");

    LayoutAnimation.easeInEaseOut();

    const percent = count / maxCount;
    const width = (screen.width - 50) * percent;
    Animated.sequence([
      Animated.delay(i * 50),
      Animated.spring(this.state.width, { toValue: width })
    ]).start();
  }

  render() {
    const screen = Dimensions.get("window");

    const { degree, count, maxCount } = this.props;

    const { width } = this.state;

    if (count === 0) return null;
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
              backgroundColor: degree.color
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
          {degree.label}
        </Text>
      </Base>
    );
  }
}

class RoastsByDegree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreview: true,
      stats: []
    };
  }

  _generateStats() {
    this.setState({
      stats: generateDegrees(this.props.roasts)
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      stats: generateDegrees(nextProps.roasts)
    });
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    this._generateStats();
    this.setState({ showPreview: false });
    // })
  }

  _renderDegrees() {
    const { stats } = this.state;

    let max = 0;
    stats.forEach(stat => {
      if (stat > max) {
        max = stat;
      }
    });

    let rendered = 0;

    return (
      <Base>
        {max === 0 ? (
          <Base px={1}>
            <Text light small>
              No roasts with roast degrees added.
            </Text>
          </Base>
        ) : (
          stats.map((stat, i) => {
            if (stat === 0) return null;
            rendered++;
            return (
              <Deg
                key={DEGREES[i].label}
                i={rendered - 1}
                degree={DEGREES[i]}
                maxCount={max}
                count={stat}
              />
            );
          })
        )}
      </Base>
    );
  }

  render() {
    return (
      <View>
        <Text mb={2} ml={1} small bold mt={2}>
          How dark do you roast your coffee?
        </Text>
        {this.state.showPreview ? <View /> : this._renderDegrees()}
      </View>
    );
  }
}

function generateDegrees(roasts) {
  const deg = [];
  for (let i = 0; i < 8; i++) {
    deg.push(0);
  }

  roasts.forEach(roast => {
    // ignore multi roasts for now
    if (roast.roasts.length > 1) return;
    const degree = roast.roasts[0].degree;
    if (typeof degree === "number") {
      deg[degree] = deg[degree] + 1;
    }
  });

  return deg;
}

function getState(state, props) {
  return {
    roasts: state.coffees.items
  };
}

export default connect(getState)(RoastsByDegree);
