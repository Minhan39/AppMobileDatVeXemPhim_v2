import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const BoxTextInput = ({
  placeholder,
  width,
  secureTextEntry,
  value,
  onChangeText,
  right,
  autoFocus,
}) => {
  return (
    <View style={Styles.boxTextInput}>
      <TextInput
        autoFocus={autoFocus}
        style={[Styles.textInput, {width: width}]}
        placeholder={placeholder}
        placeholderTextColor={'#FFFFFF'}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
      {right}
    </View>
  );
};

const Styles = StyleSheet.create({
  boxTextInput: {
    marginHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    paddingLeft: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.5)',
    height: 48,
    color: '#FFFFFF',
  },
});

export default BoxTextInput;
