import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';

const {width, height} = Dimensions.get('screen');
const Tickets = ({route}) => {
  const uNavigation = useNavigation();
  const [tickets, setTickets] = useState([]);

  const getTicketsFromApi = () => {
    return fetch('https://spidercinema.pmandono.com/api/ticket')
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getTickets = async () => {
    setTickets(await getTicketsFromApi());
  }

  useEffect(() => {
    getTickets();
    if(route.params?.refresh){
      getTickets();
    }
  }, [route.params?.refresh]);

  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} />
      <FlatList
        data={tickets ? tickets : []}
        renderItem={({item}) => (
          <Pressable
            style={Styles.ticket}
            onPress={() => uNavigation.navigate('TicketDetail', {
              cinema_name: item.cinema_name,
              openning_day: item.openning_day,
              show_time: item.show_time,
              seat: item.seat,
              id: item.id,
              movie_image: item.movie_image
            })}>
            <ImageBackground
              source={{uri: item.movie_image}}
              style={Styles.image}
              imageStyle={{borderRadius: 8}}>
              <LinearGradient
                start={{x: 0.5, y: 0}}
                end={{x: 1, y: 0}}
                colors={['rgba(9, 140, 208, 0)', 'rgba(255, 255, 255, 1)']}
                style={Styles.linear}></LinearGradient>
              <View style={Styles.circle1}></View>
              <View style={Styles.circle2}></View>
              <View style={Styles.line}></View>
            </ImageBackground>
            <View
              style={{
                backgroundColor: '#fff',
                justifyContent: 'space-evenly',
              }}>
              <View>
                <Text style={Styles.text}>
                  <FontAwesome name="map-marker" size={16} color={'#000'} />{' '}
                  {item.cinema_name}
                </Text>
                <Text style={[Styles.text, {fontSize: 12}]}>
                  <FontAwesome name="calendar" size={12} color={'#000'} />{' '}
                  {item.show_time.split(':')[0]} : {item.show_time.split(':')[1]} - {item.openning_day.split('-')[2]}/{item.openning_day.split('-')[1]}/{item.openning_day.split('-')[0]}
                </Text>
              </View>
              <Text style={Styles.text}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {(Number(item.movie_price) + Number(item.combo_price) * Number(item.number_combos)) * (1 + item.vat/100)}
                </Text>
                đ
              </Text>
            </View>
          </Pressable>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  ticket: {
    flexDirection: 'row',
    width: width - 32,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    paddingRight: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    height: 96,
    width: 150,
  },
  linear: {
    width: 150,
    height: 96,
  },
  text: {
    color: '#000',
    textAlign: 'right',
  },
  circle1: {
    backgroundColor: '#171723',
    height: 32,
    width: 32,
    borderRadius: 16,
    position: 'absolute',
    top: -18,
    left: 48,
  },
  circle2: {
    backgroundColor: '#171723',
    height: 32,
    width: 32,
    borderRadius: 16,
    position: 'absolute',
    bottom: -18,
    left: 48,
  },
  line: {
    position: 'absolute',
    height: 100,
    width: 18,
    top: 0,
    bottom: 0,
    left: 48,
    borderRightColor: '#171723',
    borderRightWidth: 3,
    borderStyle: 'dashed',
  },
});

export default Tickets;
