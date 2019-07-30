import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import AllRoasts from "./AllRoasts";
import { Base, NavBar, BackIcon, NavTouchableIcon } from "../components";

class BeanSublist extends React.Component {
  render() {
    return (
      <Base flex={1} backgroundColor="white">
        <NavBar
          backgroundColor="#e9e9ef"
          title={this.props.title}
          LeftButton={
            <NavTouchableIcon
              accessible
              accessibilityLabel="Back"
              onPress={() => {
                this.props.dispatch({ type: "POP" });
              }}
            >
              <BackIcon color="black" />
            </NavTouchableIcon>
          }
        />
        <AllRoasts
          roasts={this.props.roasts}
          filter={r => r}
          dispatch={this.props.dispatch}
        />
      </Base>
    );
  }
}

function getState(state, props) {
  const { beanName } = props;

  // sorta expensive...
  // maybe store bean id indexes, allowing for
  // quicker lookups (only if performance becomes an
  // issue). A better first step would be to
  // perform this lookup async, and render a preview
  // view instead.
  const roasts = state.coffees.items.filter(r =>
    r.beans.some(b => b.name === beanName)
  );

  return {
    roasts: _.sortBy(roasts, "date"),
    title: beanName
  };
}

export default connect(getState)(BeanSublist);
