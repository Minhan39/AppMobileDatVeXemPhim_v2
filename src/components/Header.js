import React from 'react';
import {View, Pressable, StyleSheet, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default Header = ({uNavigation, title}) => {
  return (
    <View style={Styles.header}>
      <Pressable onPress={() => uNavigation.goBack()}>
        <Feather name={'arrow-left'} size={24} color={'rgba(255,255,255,1)'} />
      </Pressable>
      {title ? (
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            textTransform: 'uppercase',
          }}>
          {title}
        </Text>
      ) : null}
      <Pressable onPress={() => uNavigation.navigate('Search')}>
        <FontAwesome name={'search'} size={24} color={'rgba(255,255,255,1)'} />
      </Pressable>
    </View>
  );
};

const Styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
    backgroundColor: '#537b2f',
  },
});
