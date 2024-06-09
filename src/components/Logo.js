import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

const Logo = () => {
  return (
    <View style={Styles.logo}>
      <Image
          style={{width: 120, height: 120}}
          source={require('../assets/img/loading2.png')}
        />
        <Text style={Styles.text}>SPIDER CINEMA</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  text: {
    color: '#537b2f',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Logo;
