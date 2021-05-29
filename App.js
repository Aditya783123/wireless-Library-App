import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TransactionScreen from "./screens/BookTransactionScreen";
import SearchScreen from "./screens/SearchScreen";
import LoginScreen from "./screens/LoginScreen";

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction: { screen: TransactionScreen },
  Search: { screen: SearchScreen }
});

const SwitchNavigator = createSwitchNavigator({
   LoginScreen:{screen: LoginScreen},
   TabNavigator: {screen: TabNavigator}
})

const AppContainer = createAppContainer(SwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center"
  }
});
