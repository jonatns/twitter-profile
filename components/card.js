import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemeContext } from './theme-context';

export default ({ children, style }) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <View
          style={[
            styles.container,
            style,
            {
              backgroundColor: theme.primary,
              borderBottomColor: theme.border
            }
          ]}
        >
          {typeof children === 'function' ? children({ theme }) : children}
        </View>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    padding: 10,
    paddingBottom: 20,
    minHeight: 60
  }
});
