import React from 'react';
import {Pressable, Text} from 'react-native';

const SecondaryButton = ({onPress, text, buttonStyle, textStyle}) => {
  return (
    <Pressable style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </Pressable>
  );
};

export default SecondaryButton;
