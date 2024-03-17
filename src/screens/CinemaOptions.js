import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Text,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CitiesSchema from '../data/CitiesSchema';

const CinemaOptions = () => {
  const uNavigation = useNavigation();
  const Item = ({name}) => {
    return (
      <View style={Styles.item}>
        <Text style={Styles.itemText}>{name}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={Styles.container}>
      <View style={Styles.header}>
        <Pressable onPress={() => uNavigation.goBack()}>
          <Feather
            name={'arrow-left'}
            size={24}
            color={'rgba(255,255,255,1)'}
          />
        </Pressable>
        <FontAwesome name={'search'} size={24} color={'rgba(255,255,255,1)'} />
      </View>
      <FlatList
        data={CitiesSchema ? CitiesSchema : []}
        renderItem={({item}) => <Item name={item.name} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  item: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});

export default CinemaOptions;
