import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'rgb(230, 236, 240)',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 20,
    minHeight: 60
  }
});

export default ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};
