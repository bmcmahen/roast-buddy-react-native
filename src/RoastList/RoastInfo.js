import React from "react";
import { View, Dimensions, ART } from "react-native";
import { Base, Text, Divider, Icon } from "../components";
const { Path, Shape, Surface } = ART;

import { DEGREES } from "../data";

const Degrees = ({ degree }) => {
  const screen = Dimensions.get("window");
  const textWidth = 100;
  const PADDING = 16;
  const width = (screen.width - PADDING) / DEGREES.length;
  const left =
    degree * width - PADDING + width / 2 - textWidth / 2 + PADDING / 2;
  const arrow = {
    left,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    width: textWidth,
    paddingBottom: 5
  };

  return (
    <Base p={2} style={{ position: "relative" }}>
      <View style={arrow}>
        {DEGREES[degree] && (
          <Text textAlign="center" tiny light style={{ lineHeight: 15 }} bold>
            {DEGREES[degree].label}
          </Text>
        )}
        <Icon
          name="chevron-down"
          color="light"
          style={{ lineHeight: 15 }}
          size={15}
          height={15}
        />
      </View>
      <Base
        row
        flex={1}
        height={50}
        style={{ borderRadius: 10, overflow: "hidden" }}
      >
        {DEGREES.map((deg, i) => {
          const isSelected = i === degree;
          return (
            <Base
              key={deg.color}
              height={50}
              flex={1}
              backgroundColor={deg.color}
            />
          );
        })}
      </Base>
    </Base>
  );
};

function formatDuration(time) {
  const minute = Math.floor(time / (60 * 1000));
  const second = Math.floor((time - 60000 * minute) / 1000);
  const ms = Math.floor((time % 1000) / 10);

  const total =
    (minute < 10 ? "0" + minute : minute) +
    ":" +
    (second < 10 ? "0" + String(second) : second);
  return total;
}

const Time = ({ time }) =>
  time ? (
    <Base flex={1} alignSelf="center" mb={2}>
      <Text small textAlign="center" light mb={1}>
        Duration
      </Text>
      <Text textAlign="center" style={{ fontSize: 30, lineHeight: 30 }} thin>
        {formatDuration(time)}
      </Text>
    </Base>
  ) : (
    <View />
  );

const datas = [
  {
    name: "name",
    values: [0, 3]
  },
  {
    name: "another",
    values: [2, 4]
  }
];

function linearConversion(a, b) {
  var o = a[1] - a[0],
    n = b[1] - b[0];

  return function(x) {
    return ((x - a[0]) * n) / o + b[0];
  };
}

const humanizeLabel = label => {
  const labels = {
    first_crack: "1st Crack",
    first_crack_finished: null,
    second_crack: "2nd Crack",
    second_crack_finished: null
  };

  return labels[label];
};

const temps = {
  first_crack: 196,
  first_crack_finished: 200,
  second_crack: 224,
  second_crack_finished: 240
};

const CrackProfile = ({ cracks, duration }) => {
  const screen = Dimensions.get("window");
  const PADDING = 30;
  const HEIGHT = 100;
  const DIAMETER = 30;
  const width = screen.width;
  const MAX_TEMP = 240;
  const SURFACE_WIDTH = width - PADDING * 3;
  const convert = linearConversion([0, duration], [0, SURFACE_WIDTH]);
  const height = linearConversion([0, MAX_TEMP], [HEIGHT, 0]);

  const points = [{ key: "start", left: convert(0), top: height(0) }];

  cracks.forEach(crack => {
    points.push({
      key: crack.key,
      time: crack.time,
      label: humanizeLabel(crack.key),
      left: convert(crack.time),
      top: height(temps[crack.key])
    });
  });

  points.push({
    key: "end",
    left: convert(duration),
    top: points[points.length - 1].top
  });

  const pairs = [];

  for (let i = 0; i <= points.length; i++) {
    const p = points[i];
    if (points[i + 1]) {
      pairs.push([points[i], points[i + 1]]);
    }
  }

  const lines = [];

  pairs.forEach((pair, i) => {
    const first = pair[0];
    const second = pair[1];

    const line = {
      start: { top: first.top, left: first.left },
      end: { top: second.top, left: second.left }
    };

    let label = "";
    if (first.key === "first_crack") {
      label = "First Crack";
      line.width = 8;
      line.color = "#866949";
    }

    if (first.key === "second_crack") {
      label = "Second Crack";
      line.width = 8;
      line.color = "#4e3519";
    }

    lines.push(line);
  });

  const colors = [
    "#866949",
    "#5c442a",
    "#4e3519",
    "#392004",
    "#050500",
    "black"
  ];

  return (
    <View
      style={{
        marginTop: 50,
        marginHorizontal: PADDING,
        height: HEIGHT,
        marginBottom: 20,
        position: "relative"
      }}
    >
      <Surface width={SURFACE_WIDTH + 10} height={HEIGHT + 30}>
        {lines.map((l, i) => {
          const start = [
            l.start.left + DIAMETER / 2,
            l.start.top + DIAMETER / 2
          ];

          const end = [
            l.end.left - start[0] + DIAMETER / 2,
            l.end.top - start[1] + DIAMETER / 2
          ];

          const path = new Path()
            .moveTo(start[0], start[1])
            .line(end[0], end[1])
            .close();

          return (
            <Shape d={path} strokeWidth={4} x={0} y={0} stroke={colors[i]} />
          );
        })}
      </Surface>
      {points.map((p, i) => (
        <View
          key={p.key + "p"}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: DIAMETER / 2,
            borderWidth: 1,
            padding: 1,
            borderColor: "white",
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              width: DIAMETER - 4,
              height: DIAMETER - 4,
              backgroundColor: colors[i],
              borderRadius: 20,
              // borderWidth: 2,
              // borderColor: 'black',
              position: "absolute",
              left: 1,
              top: 1
            }}
          />
        </View>
      ))}

      {points.map(p => {
        if (!p.label) return null;
        return (
          <Text
            key={p.key}
            bold
            tiny
            light
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              left: p.left - 20,
              top: p.top - 30,
              textAlign: "center",
              width: 70
            }}
          >
            {p.label + (p.time ? " " + formatDuration(p.time) : "")}
          </Text>
        );
      })}
    </View>
  );
};

class RoastInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: props.roast.roasts.map((tab, i) => {
        if (props.roast.roasts.length > 1) return false;
        return true;
      })
    };
  }

  render() {
    const { roast } = this.props;

    const isMelange = roast.roasts.length > 1;

    return (
      <Base>{roast.roasts.map(r => this._renderRoast(r, isMelange))}</Base>
    );
  }

  _renderRoast(roast, isMelange) {
    const title = isMelange ? roast.beans.map(b => b.name).join(", ") : "";

    return (
      <View key={roast._id}>
        {!!title && (
          <Base p={2}>
            <Text small bold>
              {title}
            </Text>
          </Base>
        )}
        {!!title && <Divider inset={16} />}

        <Base px={2} pt={2} row justifyContent="space-between">
          <Time time={roast.recordedTime} />
          {roast.other.map(this._renderStats.bind(this))}
        </Base>
        <Divider inset={isMelange ? 16 : 0} />
        {roast.cracks.length > 0 && (
          <CrackProfile cracks={roast.cracks} duration={roast.recordedTime} />
        )}

        {typeof roast.degree === "number" && <Degrees degree={roast.degree} />}

        <Base p={2}>{roast.other.map(this._renderOther.bind(this))}</Base>

        <Divider />
      </View>
    );
  }

  _renderOther(field) {
    if (field.label === "Notes") {
      if (!field.value) return null;
      return (
        <Base mb={2}>
          <Text small>{field.value}</Text>
        </Base>
      );
    }
  }

  _renderStats(field) {
    if (field.label === "Roast Weight") {
      if (!field.value) return null;
      return (
        <Base flex={1} alignSelf="center" mb={2}>
          <Text textAlign="center" small light mb={1}>
            Weight
          </Text>
          <Text
            textAlign="center"
            style={{ fontSize: 30, lineHeight: 30 }}
            thin
          >
            {field.value + "g"}
          </Text>
        </Base>
      );
    }

    if (field.label === "Temperature") {
      if (!field.value) return null;
      return (
        <Base flex={1} alignSelf="center" mb={2}>
          <Text textAlign="center" small light mb={1}>
            Temperature
          </Text>
          <Text
            textAlign="center"
            style={{ fontSize: 30, lineHeight: 30 }}
            thin
          >
            {field.value + "°C"}
          </Text>
        </Base>
      );
    }
  }
}

export default RoastInfo;
