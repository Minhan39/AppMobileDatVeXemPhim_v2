import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Index from './src/navigators/Index';

export default App = () => {
  return (
    <View style={Styles.container}>
      <StatusBar backgroundColor={'#171723'} barStyle={'light-content'} />
      <Index />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
