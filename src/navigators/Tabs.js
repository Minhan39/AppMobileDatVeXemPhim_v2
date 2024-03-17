import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useTheme} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/Home';
import TicketsScreen from '../screens/Tickets';
import AccountScreen from '../screens/Account';

const Tab = createMaterialBottomTabNavigator();
export default Tabs = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = 'transperent';

  return (
    <Tab.Navigator
      activeColor="#FFFFFF"
      inactiveColor="#686D76"
      barStyle={{backgroundColor: '#23232e'}}
      shifting={true}
      initialRouteName={'Home'}>
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome name={'home'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={'Tickets'}
        component={TicketsScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name={'ticket-sharp'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={'Account'}
        component={AccountScreen}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome name={'user'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
