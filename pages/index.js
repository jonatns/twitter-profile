import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import Link from "next/link";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: "100%"
  },
  sideNav: {
    backgroundColor: "#ecf0f1",
    shadowColor: "#90A4AE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  main: {
    flex: 1,
    height: "100%"
  },
  header: {
    backgroundColor: "#3498db",
    height: 60,
    shadowColor: "#90A4AE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15
  },
  menuIcon: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center"
  },
  menuIconImage: {
    height: 33,
    width: 33
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

class Index extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.header}>
            <View style={styles.headerContent} />
          </View>
          <View style={styles.content} onTouchStart={this.handleMenuIconPress}>
            <Text>Content</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
