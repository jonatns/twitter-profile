import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Card from './card';

const styles = StyleSheet.create({
  container: {
    minHeight: 200
  }
});

export default () => {
  return <Card style={styles.container}>{<ActivityIndicator animating size={26} />}</Card>;
};
