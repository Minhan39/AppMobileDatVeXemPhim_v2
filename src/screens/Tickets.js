import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {UserContext} from '../services/UserContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import {convertDate, convertTime2} from '../utils/Logic';

const {width, height} = Dimensions.get('screen');
const Tickets = ({route}) => {
  const uNavigation = useNavigation();
  const context = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get tickets from API
  const getTicketsFromApi = () => {
    return fetch(`https://anpm.io.vn/api/tickets/${context.user.id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Function call to get tickets from API
  const getTickets = async () => {
    setIsLoading(true);
    try {
      setTickets(await getTicketsFromApi());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
    if (route.params?.refresh) {
      getTickets();
    }
  }, [route.params?.refresh]);

  return isLoading ? (
    <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
  ) : (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'Tickets'} />
      {tickets.length > 0 ? (
        <FlatList
          style={{marginTop: 16}}
          data={tickets ? tickets : []}
          renderItem={({item}) => (
            <Pressable
              style={[
                Styles.ticket,
                {backgroundColor: `rgb(${item.primary_color_background})`},
              ]}
              onPress={() =>
                uNavigation.navigate('TicketDetail', {
                  cinema_name: item.cinema_name,
                  screening_date: item.screening_date,
                  screening_time: item.screening_time,
                  id: item.id,
                  movie_image: item.movie_poster,
                  seats: item.seats,
                  color_background: item.primary_color_background,
                  color_text: item.primary_color_text,
                })
              }>
              <ImageBackground
                source={{
                  uri: 'https://anpm.io.vn/public/storage/' + item.movie_poster,
                }}
                style={Styles.image}
                imageStyle={{borderRadius: 8}}>
                <LinearGradient
                  start={{x: 0.5, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={[
                    `rgba(${item.primary_color_background}, 0)`,
                    `rgba(${item.primary_color_background}, 1)`,
                  ]}
                  style={Styles.linear}></LinearGradient>
                <View style={Styles.circle1}></View>
                <View style={Styles.circle2}></View>
                <View style={Styles.line}></View>
              </ImageBackground>
              <View
                style={{
                  backgroundColor: `rgb(${item.primary_color_background})`,
                  justifyContent: 'space-evenly',
                }}>
                <View>
                  <Text style={[Styles.text, {color: item.primary_color_text}]}>
                    <FontAwesome
                      name="map-marker"
                      size={14}
                      color={item.primary_color_text}
                    />{' '}
                    {item.cinema_name}
                  </Text>
                  <Text
                    style={[
                      Styles.text,
                      {color: item.primary_color_text, fontSize: 14},
                    ]}>
                    <FontAwesome
                      name="calendar"
                      size={14}
                      color={item.primary_color_text}
                    />{' '}
                    {convertDate(new Date(item.screening_date))}
                  </Text>
                  <Text
                    style={[
                      Styles.text,
                      {color: item.primary_color_text, fontSize: 14},
                    ]}>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={item.primary_color_text}
                    />{' '}
                    {convertTime2(item.screening_time)} - {item.duration}
                  </Text>
                </View>
                <Text style={[Styles.text, {color: item.primary_color_text}]}>
                  <MaterialCommunityIcons
                    name="seat"
                    size={14}
                    color={item.primary_color_text}
                  />{' '}
                  {item.seats}
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 16}}>
            You don't have any ticket!!!
          </Text>
        </View>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  ticket: {
    flexDirection: 'row',
    width: width - 32,
    marginHorizontal: 16,
    justifyContent: 'space-between',
    paddingRight: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    height: 128,
    width: 124,
  },
  linear: {
    width: 124,
    height: 128,
  },
  text: {
    color: '#000',
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  circle1: {
    backgroundColor: '#FFF',
    height: 32,
    width: 32,
    borderRadius: 16,
    position: 'absolute',
    top: -18,
    left: 48,
  },
  circle2: {
    backgroundColor: '#FFF',
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
    borderRightColor: '#FFF',
    borderRightWidth: 3,
    borderStyle: 'dashed',
  },
});

export default Tickets;
