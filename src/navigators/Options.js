import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useTheme} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TicketOptionsScreen from '../screens/TicketOptions';
import CinemaOptionsScreen from '../screens/CinemaOptions';

const Option = createMaterialBottomTabNavigator();
export default Options = () => {
  return (
    <Option.Navigator
      activeColor="#FFFFFF"
      inactiveColor="#686D76"
      barStyle={{backgroundColor: '#23232e'}}
      shifting={true}
      initialRouteName={'TicketOptions'}>
      <Option.Screen
        name={'TicketOptions'}
        component={TicketOptionsScreen}
        options={{
          tabBarLabel: 'Recommend',
          tabBarIcon: ({color}) => (
            <FontAwesome name={'calendar'} size={24} color={color} />
          ),
        }}
      />
      <Option.Screen
        name={'CinemaOptions'}
        //component={CinemaOptionsScreen}
        component={TicketOptionsScreen}
        options={{
          tabBarLabel: 'Cinemas',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name={'theater'} size={24} color={color} />
          ),
        }}
      />
    </Option.Navigator>
  );
};
