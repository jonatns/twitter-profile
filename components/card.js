import React from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "rgb(230, 236, 240)",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    flex: 1,
    minHeight: 200
  }
});

export default ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};
