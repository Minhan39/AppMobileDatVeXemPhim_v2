import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Tabs from './Tabs';
import Options from './Options';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import SearchScreen from '../screens/Search';
import DetailScreen from '../screens/Detail';
import MovieListScreen from '../screens/MovieList';
import CategoryScreen from '../screens/Category';
import SeatsScreen from '../screens/Seats';
import ComboOptionsScreen from '../screens/ComboOptions';
import TicketDetailScreen from '../screens/TicketDetail';
import PaymentScreen from '../screens/Payment';
import TicketOptionsScreen from '../screens/TicketOptions';
import Loading from '../screens/Loading';
import SendEmailScreen from '../screens/SendEmail';

const Stack = createStackNavigator();
export default Root = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'Loading'}>
        <Stack.Screen name={'Loading'} component={Loading} />
        <Stack.Screen name={'Tabs'} component={Tabs} />
        <Stack.Screen name={'TicketOption'} component={TicketOptionsScreen} />
        {/* <Stack.Screen name={'Options'} component={Options} /> */}
        <Stack.Screen name={'Login'} component={LoginScreen} />
        <Stack.Screen name={'Register'} component={RegisterScreen} />
        <Stack.Screen name={'Search'} component={SearchScreen} />
        <Stack.Screen name={'Detail'} component={DetailScreen} />
        <Stack.Screen
          name={'MovieList'}
          component={MovieListScreen}
          // initialParams={{category_id: 1}}
        />
        <Stack.Screen name={'Category'} component={CategoryScreen} />
        <Stack.Screen name={'Seat'} component={SeatsScreen} />
        <Stack.Screen name={'ComboOptions'} component={ComboOptionsScreen} />
        <Stack.Screen name={'TicketDetail'} component={TicketDetailScreen} />
        <Stack.Screen name={'Payment'} component={PaymentScreen} />
        <Stack.Screen name={'SendEmail'} component={SendEmailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
