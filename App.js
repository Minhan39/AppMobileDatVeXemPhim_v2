import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Index from './src/navigators/Index';
import {UserProvider} from './src/services/UserContext';

export default App = () => {
  return (
    <UserProvider>
      <View style={Styles.container}>
        <StatusBar backgroundColor={'#171723'} barStyle={'light-content'} />
        <Index />
      </View>
    </UserProvider>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
