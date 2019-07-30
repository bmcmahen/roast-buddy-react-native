import React from "react";
import { connect } from "react-redux";
import { NetInfo } from "react-native";
import { fetchBeans } from "./src/actions/beans";
import { fetchCoffees } from "./src/actions/coffee";
import { syncAllLocalChanges } from "./src/actions/coffee";

class Boot extends React.Component {
  componentDidMount() {
    const { dispatch, user } = this.props;

    if (user.isLoggedIn) {
      dispatch(fetchCoffees());
      dispatch(syncAllLocalChanges());
    }

    dispatch(fetchBeans());

    this._handleNetworkChange = this._handleNetworkChange.bind(this);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this._handleNetworkChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "change",
      this._handleNetworkChange
    );
  }

  _handleNetworkChange(isConnected) {
    if (isConnected) {
      if (this.props.user.isLoggedIn) {
        this.props.dispatch(syncAllLocalChanges());
      }
    }
  }

  render() {
    return null;
  }
}

function getState(state) {
  return {
    user: state.user
  };
}

export default connect(getState)(Boot);
