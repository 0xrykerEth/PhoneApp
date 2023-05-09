import { Text, View } from "react-native";
import React from "react";

export default function Separator({
  width = "90%",
  height = 1,
  backgroundColor = "#d3d3d3",
  borderRadius = 100,
  style,
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor,
          alignSelf: "center",
          borderRadius,
        },
        style,
      ]}
    />
  );
}
