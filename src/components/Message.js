import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Message = ({height, message, icon}) => {
  return (
    <View style={[Styles.message, {height: height}]}>
      <Icon name={icon} size={16} color={'#FFA500'} />
      <Text style={Styles.text}>{message}</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  message: {
    alignItems: 'center',
    paddingLeft: 32,
    flexDirection: 'row',
  },
  text: {
    paddingLeft: 8,
    color: '#FFA500',
  },
});

export default Message;
