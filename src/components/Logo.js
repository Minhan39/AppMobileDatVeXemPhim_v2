import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Logo = () => {
  return (
    <View style={Styles.logo}>
      <Text style={Styles.text}>SPIDER</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
  },
  text: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: 72,
  },
});

export default Logo;
