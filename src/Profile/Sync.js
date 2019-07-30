import React from "react";
import {
  Base,
  Text,
  Loader,
  Icon,
  Button,
  InputGroup,
  SectionHeader
} from "../components";
import moment from "moment";
import _ from "lodash";
import { Alert } from "react-native";
import { DEGREES } from "../data";
import { syncAllLocalChanges, fetchCoffees } from "../actions/coffee";

class Sync extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      syncing: false
    };
  }

  render() {
    const { roasts } = this.props;
    const { isFetching, deleting } = roasts;
    const { syncing } = this.state;

    const toDelete = Object.keys(deleting)
      .filter(item => !item)
      .map(item => {
        return {
          ...item,
          isDeleting: true
        };
      });

    const notSynced = _.filter(roasts.items, item => {
      return item.status !== "sync-success";
    }).concat(toDelete);

    const total = notSynced.length;

    return (
      <Base>
        <SectionHeader>
          Unsynced Changes
          <Text thin light small>
            {isFetching ? "(Fetching...)" : ""}
          </Text>
        </SectionHeader>

        {total === 0 ? (
          <Text ml={2} small light>
            All items synced to server
          </Text>
        ) : (
          <Base backgroundColor="white">
            <InputGroup inset={16}>
              {notSynced.slice(0, 5).map(item => this._renderItem(item))}
            </InputGroup>
            {total > 5 && <Text p={2}>+ {total - 5} more</Text>}
          </Base>
        )}
        {/* <Divider /> */}
        <Base>
          <Button
            small
            alignSelf="flex-start"
            intent="primary"
            disabled={isFetching || syncing}
            m={2}
            onPress={() => this._sync()}
          >
            Sync with server
          </Button>
        </Base>
      </Base>
    );
  }

  _fetch(done) {
    this.props.dispatch(fetchCoffees(done));
  }

  _sync() {
    this.setState({ syncing: true });

    this._fetch(err => {
      const fn = syncAllLocalChanges(callback => {
        this.setState({ syncing: false });
        if (err) {
          Alert.alert(
            "Whoops, an error occurred while fetching documents from the server.",
            "Please try again later."
          );
        }
      });

      this.props.dispatch(fn);
    });
  }

  _renderItem(roast) {
    if (!roast) return null;
    const { status, isDeleting } = roast;
    const isBlend = roast.beans.length > 1;
    let name = isBlend ? roast.name : roast.beans[0].name;
    if (isDeleting) {
      name += " - Deleting";
    }

    const date = moment(roast.date)
      .local()
      .format("MMM DD, YYYY");

    const deg =
      roast.roasts.length > 1
        ? "Melange"
        : DEGREES[roast.roasts[0].degree]
        ? DEGREES[roast.roasts[0].degree].label
        : "";

    return (
      <Base
        key={roast._id}
        px={2}
        row
        alignroasts="center"
        justifyContent="space-between"
      >
        <Base flex={1} style={{ paddingVertical: 10 }}>
          <Text numberOfLines={1} bold small style={{ lineHeight: 20 }}>
            {name}
          </Text>
          <Text numberOfLines={1} small style={{ lineHeight: 20 }} light>
            {date} {isBlend ? "- Blend" : ""} {deg ? "- " + deg : ""}
          </Text>
        </Base>
        <Base row align="center">
          {status === "sync-error" && (
            <Icon
              ml={2}
              accessibilityLabel="error syncing"
              size={25}
              color="red"
              name="alert-octagon"
            />
          )}
          {status === "sync" && <Loader showText={false} flex={0} small />}
        </Base>
      </Base>
    );
  }
}

export default Sync;
