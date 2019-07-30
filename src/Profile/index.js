import React from "react";
import { connect } from "react-redux";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sexy: false
    };
  }

  render() {
    const { dispatch, user, roasts, hasRoasts } = this.props;

    if (!user.isLoggedIn) {
      return <LoggedOut dispatch={dispatch} />;
    }

    return (
      <LoggedIn
        roasts={roasts}
        hasRoasts={hasRoasts}
        dispatch={dispatch}
        user={user}
      />
    );
  }
}

function getState(state) {
  return {
    user: state.user,
    hasRoasts: state.coffees.items.length > 0,
    roasts: state.coffees
  };
}

export default connect(getState)(Profile);
