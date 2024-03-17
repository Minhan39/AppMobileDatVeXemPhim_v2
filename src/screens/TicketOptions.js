import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Pressable, Text, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {weekdays} from '../utils/Logic';
import PrimaryButton from '../components/PrimaryButton';

const TicketOptions = ({route}) => {
  const uNavigation = useNavigation();
  const [calendar, setCalendar] = useState([]);
  const [showTime, setShowTime] = useState([]);
  const [openning, setOpenning] = useState();
  const [cinemaId, setCinemaId] = useState();
  const [button, setButton] = useState(true);

  const getCalendarFromApi = (date) => {
    const now = new Date();
    let url = `https://spidercinema.pmandono.com/api/calendar/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    if(date != null){
      const arr = date.split('/');
      url = `https://spidercinema.pmandono.com/api/calendar/${now.getFullYear()}-${arr[1]}-${arr[0]}`;
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

  const onClick = (date) => {
    getCalender(date);
    if(showTime.length > 0 && openning != null && date.split('/')[0] == openning.split('-')[2]){
      setButton(false);
    }
    else{
      setButton(true);
    }
  }

  const getCalender = async (date) => {
    return setCalendar(await getCalendarFromApi(date));
  }

  const onShowTime = (id, time, date, cinemaId) => {
    setShowTime([id,time]);
    setOpenning(date);
    setButton(false);
    setCinemaId(cinemaId);
  }

  useEffect(() => {
    getCalender(null);
    console.log(route.params?.movie_id);
  }, [route.params?.movie_id]);

  return (
    <View style={Styles.container}>
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
        horizontal
        data={weekdays ? weekdays : []}
        renderItem={({item}) => (
          <Pressable style={Styles.week} onPress={() => onClick(item.date)}>
            <View style={Styles.date}>
              <Text style={Styles.dday}>{item.date}</Text>
              <Text style={Styles.day}>{item.weekday}</Text>
            </View>
          </Pressable>
        )}
        style={{flexGrow: 0}}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-around',
        }}
      />
      <FlatList
        data={calendar ? calendar : []}
        renderItem={({item}) => (
          <View style={{marginTop: 8}}>
            <Text style={Styles.cinemaText}>{item.name}</Text>
            <FlatList
              horizontal
              data={item.times ? item.times : []}
              extraData={[item.id, item.date, item.cinema_id]}
              renderItem={({item: timeItem}) => (
                <Pressable 
                  style={[Styles.time, {
                    backgroundColor: showTime[0] == item.id && showTime[1] == timeItem ? 'rgba(255, 255, 255, 0.8)' : 'rgba(196, 196, 196, 0.07)'}]
                  } 
                  onPress={() => onShowTime(item.id,timeItem,item.date,item.cinema_id)}
                >
                  <Text style={{color: showTime[0] == item.id && showTime[1] == timeItem ? '#000' : '#fff'}}>{timeItem.split(':')[0]}:{timeItem.split(':')[1]}</Text>
                </Pressable>
              )}
            />
          </View>
        )}
      />
      <View style={{marginBottom: 16}}>
        <PrimaryButton
          value={'Buy ticket'}
          onPress={() => uNavigation.navigate('Seat', {
            movie_id: route.params?.movie_id,
            openning_day: openning,
            show_time: showTime[1],
            cinema_id: cinemaId
          })}
          disabled={button}
        />
      </View>
    </View>
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
  date: {
    backgroundColor: 'rgba(196, 196, 196, 0.07)',
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dday: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  day: {
    color: '#CCCCCC',
    fontSize: 10,
  },
  cinemaText: {
    color: '#FFFFFF',
    marginBottom: 8,
    paddingLeft: 16,
  },
  time: {
    padding: 16,
    marginRight: 16,
  },
});

export default TicketOptions;
