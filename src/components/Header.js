import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default Header = ({uNavigation}) => {
  return (
    <View style={Styles.header}>
      <Pressable onPress={() => uNavigation.goBack()}>
        <Feather name={'arrow-left'} size={24} color={'rgba(255,255,255,1)'} />
      </Pressable>
      <FontAwesome name={'search'} size={24} color={'rgba(255,255,255,1)'} />
    </View>
  );
};

const Styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
});
