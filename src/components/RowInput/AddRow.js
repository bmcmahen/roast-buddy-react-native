import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Icon, Base, TouchableInput } from "../index";

const GreenPlusIcon = () => (
  <Base backgroundColor="green" mr={2} style={styles.iconButton}>
    <Icon name="plus" size={15} color="white" />
  </Base>
);

/**
 * Arrow row button. Typically the condensed form
 * will be used in conjunction with <RemovableInput />
 */

const AddRow = ({ label, onPress, backgroundColor, disabled, ...other }) => (
  <TouchableInput
    disabled={disabled}
    label={label}
    labelColor="primary"
    icon={<GreenPlusIcon />}
    backgroundColor={backgroundColor}
    onPress={onPress}
    {...other}
  />
);

AddRow.displayName = "AddRow";

AddRow.propTypes = {
  backgroundColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

AddRow.defaultProps = {
  backgroundColor: "white"
};

export default AddRow;

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  container: {
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: "center"
  },
  iconButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "center",
    alignSelf: "center",
    padding: 2,
    paddingLeft: 3
  },
  icon: {
    backgroundColor: "transparent",
    marginTop: 0
  },
  label: {
    paddingLeft: 5
  },
  disabled: {
    opacity: 0.3
  }
});
