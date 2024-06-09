import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EyeButton = ({onChangeHidePassword, icon}) => {
  return (
    <TouchableOpacity style={Styles.eyeButton} onPress={onChangeHidePassword}>
      <Icon name={icon} size={24} color="#000" />
    </TouchableOpacity>
  );
};

const Styles = StyleSheet.create({
  eyeButton: {
    height: 48,
    justifyContent: 'center',
  },
});

export default EyeButton;
