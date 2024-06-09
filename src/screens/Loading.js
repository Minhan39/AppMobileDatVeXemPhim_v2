import React, {useContext, useEffect, useRef} from 'react';
import {Animated, View, Text, StyleSheet, Image} from 'react-native';
import {UserContext} from '../services/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FadeInView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

const Loading = ({navigation}) => {
  const context = useContext(UserContext);
  //get data user in async storage
  const getDataAsyncStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('USER');
      console.log('Data user in async storage: ', JSON.parse(jsonValue));
      //navigation to tabs screen if user is already logged in
      if (jsonValue != null) {
        context.setUser(JSON.parse(jsonValue));
        navigation.navigate('Tabs');
      } else {
        navigation.navigate('Login');
      }
    } catch (e) {
      console.error('Error get data user in async storage: ', e);
    }
  };
  // deplay screen
  useEffect(() => {
    setTimeout(() => {
      getDataAsyncStorage();
    }, 3000);
  }, []);
  return (
    <View style={Styles.container}>
      <FadeInView style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={{width: 160, height: 160}}
          source={require('../assets/img/loading2.png')}
        />
        <Text style={Styles.text}>SPIDER CINEMA</Text>
      </FadeInView>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#537b2f',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Loading;
