import React from "react";
import { Ionicons } from "@expo/vector-icons";
import config from "../components/config";

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? config.colors.primary : config.colors.darkgray}
    />
  );
}
