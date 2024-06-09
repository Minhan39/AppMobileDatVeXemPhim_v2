import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PrimaryButton from './PrimaryButton';

const Price = ({price, titleButton, onPress, disabled}) => {
  return (
    <View style={Styles.footer}>
      <View style={Styles.shadow}>
        <View style={Styles.price}>
          <Text style={{color: '#000000', fontFamily: 'roboto', fontSize: 16}}>
            PRICE
          </Text>
          <Text
            style={{
              fontFamily: 'roboto',
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 20,
            }}>
            {price}
          </Text>
        </View>
        <PrimaryButton
          customStyle={Styles.button}
          value={titleButton}
          onPress={onPress}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  footer: {
    height: 112,
    paddingTop: 4,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  shadow: {
    height: 108,
    elevation: 4,
    marginHorizontal: -6,
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
