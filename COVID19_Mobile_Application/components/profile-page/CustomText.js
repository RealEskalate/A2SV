import React, { Component } from "react";
import { Text } from "react-native";
export default (props) => (
  <Text {...props} style={[{ fontFamily: "PlayfairDisplay" }, props.style]}>
    {props.children}
  </Text>
);
