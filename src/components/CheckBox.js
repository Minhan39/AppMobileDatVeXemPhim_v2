import React from 'react';
import {StyleSheet, Pressable, View} from 'react-native';

const Checkbox = ({disabled, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        Styles.checkbox,
        {backgroundColor: disabled ? '#CCCCCC' : '#FF0000'},
      ]}>
      <View
        style={[
          Styles.checkboxButton,
          {backgroundColor: disabled ? '#FFFFFF' : '#FF0000'},
        ]}></View>
      <View
        style={[
          Styles.checkboxButton,
          {backgroundColor: disabled ? '#CCCCCC' : '#FFFFFF'},
        ]}></View>
    </Pressable>
  );
};

const Styles = StyleSheet.create({
  checkbox: {
    height: 24,
    width: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginHorizontal: 2,
  },
});

export default Checkbox;
