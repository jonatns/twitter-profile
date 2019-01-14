import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Card from './card';

const styles = StyleSheet.create({
  container: {
    minHeight: 200
  }
});

const LoadingCard = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <Card style={styles.container}>
      {<ActivityIndicator animating size={26} />}
    </Card>
  );
};

export default LoadingCard;
