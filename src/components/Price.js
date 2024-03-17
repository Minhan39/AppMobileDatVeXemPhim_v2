import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PrimaryButton from './PrimaryButton';

const Price = ({price, titleButton, onPress, disabled}) => {
  return (
    <View style={Styles.footer}>
      <View style={Styles.price}>
        <Text style={{color: '#000000'}}>Price</Text>
        <Text style={{fontWeight: 'bold', color: '#000000', fontSize: 24}}>
          {price} VND
        </Text>
      </View>
      <PrimaryButton
        customStyle={Styles.button}
        value={titleButton}
        onPress={onPress}
        disabled={disabled}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  footer: {
    height: 100,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    width: 160,
    marginHorizontal: 0,
  },
});

export default Price;
