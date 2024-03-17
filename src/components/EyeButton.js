import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EyeButton = ({onChangeHidePassword, icon}) => {
  return (
    <TouchableOpacity style={Styles.eyeButton} onPress={onChangeHidePassword}>
      <Icon name={icon} size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const Styles = StyleSheet.create({
  eyeButton: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#FFFFFF',
    height: 48,
    justifyContent: 'center',
  },
});

export default EyeButton;
