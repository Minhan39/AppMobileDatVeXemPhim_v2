import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

const BoxTextInput = ({
  placeholder,
  width,
  title,
  secureTextEntry,
  value,
  onChangeText,
  right,
  autoFocus,
  message,
  isRequired,
}) => {
  return (
    <View style={{...Styles.container, width: width}}>
      <Text style={Styles.title}>
        {title}{' '}
        {isRequired === true ? <Text style={{color: '#537b2f'}}>*</Text> : null}
      </Text>
      <View style={Styles.boxTextInput}>
        <TextInput
          autoFocus={autoFocus}
          style={Styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={'#CCCCCC'}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
        {right}
      </View>
      {message != '' ? <Text style={Styles.message}>{message}</Text> : null}
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  boxTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  textInput: {
    height: 48,
    color: '#000',
    fontFamily: 'Roboto',
    width: 'auto',
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  message: {
    color: '#537b2f',
    fontSize: 12,
    fontFamily: 'Roboto',
    // paddingTop: 4,
    // paddingLeft: 8,
  },
});

export default BoxTextInput;
