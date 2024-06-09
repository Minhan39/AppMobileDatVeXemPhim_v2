import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Pressable,
  Text,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {weekdays} from '../utils/Logic';
import PrimaryButton from '../components/PrimaryButton';
import Header from '../components/Header';

const TicketOptions = ({route}) => {
  const uNavigation = useNavigation();
  const [calendar, setCalendar] = useState([]);
  const [showTime, setShowTime] = useState([]);
  const [cinemaId, setCinemaId] = useState();
  const [button, setButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const getCalendarFromApi = date => {
    const now = new Date();
    let url = `https://anpm.io.vn/api/showtimes/${
      route.params?.movie_id
    }/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    if (date != null) {
      const arr = date.split('/');
      url = `https://anpm.io.vn/api/showtimes/${
        route.params?.movie_id
      }/${now.getFullYear()}-${arr[1]}-${arr[0]}`;
    }
    console.log(url);
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onClick = date => {
    setIsLoading(true);
    try {
      getCalender(date);
      setButton(true);
      setShowTime([]);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const getCalender = async date => {
    return setCalendar(await getCalendarFromApi(date));
  };

  const onShowTime = (id, time, cinemaId) => {
    setShowTime([id, time]);
    setButton(false);
    setCinemaId(cinemaId);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      getCalender(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    if (route.params?.movie_id) {
      console.log('MOVE TO SHOWTIME SCREEN ...');
      console.log('Movie ID: ', route.params.movie_id);
    }
  }, [route.params?.movie_id]);

  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'Time to check'} />
      <FlatList
        horizontal
        data={weekdays ? weekdays : []}
        renderItem={({item}) => (
          <View style={{padding: 4}}>
            <Pressable style={Styles.week} onPress={() => onClick(item.date)}>
              <View style={Styles.date}>
                <Text style={Styles.dday}>{item.date}</Text>
                <Text style={Styles.day}>{item.weekday}</Text>
              </View>
            </Pressable>
          </View>
        )}
        style={{flexGrow: 0, paddingTop: 8, paddingHorizontal: 4}}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-around',
        }}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
      ) : calendar.length == 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 16}}>
            No showtimes available
          </Text>
        </View>
      ) : (
        <FlatList
          data={calendar ? calendar : []}
          renderItem={({item}) => (
            <View style={{marginTop: 8}}>
              <Text style={Styles.cinemaText}>{item.cinema_name}</Text>
              <FlatList
                style={{paddingLeft: 16, paddingTop: 8}}
                horizontal
                data={item.screening_times ? item.screening_times : []}
                extraData={[item.id, item.date, item.cinema_id]}
                renderItem={({item: time_item}) => (
                  <View style={{padding: 4}}>
                    <Pressable
                      style={[
                        Styles.time,
                        {
                          backgroundColor:
                            showTime[0] == time_item.showtime_id &&
                            showTime[1] == time_item.time
                              ? '#537b2f'
                              : '#fff',
                          elevation: 4,
                        },
                      ]}
                      onPress={() =>
                        onShowTime(
                          time_item.showtime_id,
                          time_item.time,
                          item.id,
                        )
                      }>
                      <Text
                        style={{
                          color:
                            showTime[0] == time_item.showtime_id &&
                            showTime[1] == time_item.time
                              ? '#fff'
                              : '#000',
                          fontSize: 16,
                          fontWeight: '600',
                        }}>
                        {time_item.time.split(':')[0]}:
                        {time_item.time.split(':')[1]}
                      </Text>
                    </Pressable>
                  </View>
                )}
              />
            </View>
          )}
        />
      )}
      <View
        style={{
          marginBottom: 16,
          paddingHorizontal: 16,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <PrimaryButton
          value={'Buy ticket'}
          onPress={() =>
            uNavigation.navigate('Seat', {
              cinema_id: cinemaId,
              showtime_id: showTime[0],
            })
          }
          disabled={button || isLoading}
        />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  date: {
    elevation: 4,
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dday: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'roboto',
    fontWeight: 'bold',
  },
  day: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'roboto',
  },
  cinemaText: {
    color: '#000',
    fontSize: 16,
    textTransform: 'uppercase',
    marginLeft: 16,
    fontFamily: 'roboto',
  },
  time: {
    padding: 16,
    borderRadius: 8,
  },
});

export default TicketOptions;
