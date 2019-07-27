import React from "react";
import { Base, Text, Loader, Icon, Button, InputGroup } from "../components";
import _ from "lodash";
import { Alert } from "react-native";
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
        <Base p={2} py={1} mt={3}>
          <Text small bold>
            Unsynced Changes{" "}
            <Text thin light small>
              {isFetching ? "(Fetching...)" : ""}
            </Text>
          </Text>
        </Base>
        {total === 0 ? (
          <Text ml={2} small light>
            All items synced to server
          </Text>
        ) : (
          <Base>
            <InputGroup inset={16}>
              {notSynced.slice(0, 5).map(item => this._renderItem(item))}
            </InputGroup>
            {total > 5 && <Text p={2}>+ {total - 5} more</Text>}
            <Base>
              <Button
                small
                primary
                outline
                disabled={isFetching || syncing}
                m={2}
                onPress={() => this._sync()}
              >
                Sync with server
              </Button>
            </Base>
          </Base>
        )}
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

  _renderItem(item) {
    if (!item) return null;
    const { status, isDeleting } = item;
    const isBlend = item.beans.length > 1;
    let name = isBlend ? item.name : item.beans[0].name;
    if (isDeleting) {
      name += " - Deleting";
    }
    return (
      <Base
        key={item._id}
        height={40}
        px={2}
        row
        alignItems="center"
        justifyContent="space-between"
      >
        <Text>{name}</Text>
        {status === "sync-error" && (
          <Icon
            ml={2}
            accessibilityLabel="error syncing"
            size={20}
            color="red"
            name="ios-alert"
          />
        )}
        {status === "sync" && <Loader showText={false} flex={0} small />}
      </Base>
    );
  }
}

export default Sync;
