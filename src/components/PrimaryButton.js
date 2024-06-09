import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

const Button = ({value, onPress, disabled, customStyle}) => {
  return (
    <Pressable
      style={[
        Styles.button,
        {backgroundColor: disabled ? '#CCCCCC' : '#537b2f'},
        customStyle,
      ]}
      onPress={onPress}
      disabled={false}>
      <Text style={Styles.text}>{value}</Text>
    </Pressable>
  );
};

const Styles = StyleSheet.create({
  button: {
    backgroundColor: '#537b2f',
    height: 48,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Button;
