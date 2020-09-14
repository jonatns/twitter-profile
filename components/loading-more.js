import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
  },
});

const LoadingMore = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      {<ActivityIndicator animating size={26} />}
    </View>
  );
};

export default LoadingMore;
