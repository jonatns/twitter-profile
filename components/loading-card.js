import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

import Card from './card';

export default ({ isLoading }) => {
  return <Card>{isLoading && <ActivityIndicator animating size={26} />}</Card>;
};
