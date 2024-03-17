import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

const Button = ({value, onPress, disabled, customStyle}) => {
  return (
    <Pressable
      style={[
        Styles.button,
        {backgroundColor: disabled ? '#CCCCCC' : '#FF0000'},
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
    backgroundColor: '#FF0000',
    height: 48,
    marginHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Button;
