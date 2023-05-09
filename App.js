import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Home from "./app/components/Home";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import TabNavigator from "./app/navigation/TabNavigator";

const CUSTOM_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#ffffff" },
};

export default function App() {
  return (
    <NavigationContainer theme={CUSTOM_THEME}>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
