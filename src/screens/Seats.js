import React, { useEffect, useState } from 'react';
import {Pressable, StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import Price from '../components/Price';

const generateSeat = () => {
  let array = [];
  let num = 0;
  let numRow = 6;
  let numCol = 8;
  for (let i = 0; i < numRow; i++) {
    let colArray = [];
    for (let j = 0; j < (i % 2 == 0 ? numCol : numCol + 1); j++) {
      num++;
      let obj = {
        num: num,
        empty: Math.random() >= 0.5,
        selected: false,
      };
      colArray.push(obj);
    }
    array.push(colArray);
  }
  return array;
};

const Seats = ({route}) => {
  const uNavigation = useNavigation();
  const [seats, setSeats] = useState([]);
  const [seat, setSeat] = useState([]);
  const [movie, setMovie] = useState({});
  const [price, setPrice] = useState("0");
  const [button, setButton] = useState(true);

  const getMovieFromApi = (id) => {
    return fetch(`https://spidercinema.pmandono.com/api/movie/${id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onClick = (enable,i,j) => {
    if(enable){
      setSeat([i,j]);
      setPrice(Math.floor(movie.price));
      setButton(false);
    }
    console.log(i,j);
  }

  useEffect(() => {
    const getMovie = async (id) => {
      setMovie(await getMovieFromApi(id));
    }
    if(route.params?.movie_id){
      getMovie(route.params?.movie_id);
    }
    console.log(route.params?.movie_id);
    console.log(route.params?.openning_day);
    console.log(route.params?.show_time);
    console.log(route.params?.cinema_id);
    setSeats(generateSeat());
  }, [
    route.params?.movie_id,
    route.params?.openning_day,
    route.params?.show_time,
    route.params?.cinema_id
  ]);

  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} />
      <View style={Styles.col}>
        <MaterialCommunityIcons
          name="monitor-screenshot"
          size={40}
          color={'#FFFFFF'}
          style={{marginBottom: 16}}
        />
        {seats.map((item, index) => {
          return (
            <View key={index} style={Styles.row}>
              {item.map((subItem, subIndex) => {
                return (
                  <Pressable
                    key={subItem.num}
                    style={[
                      Styles.seat,
                      {backgroundColor: subItem.empty ? seat[0] == index && seat[1] == subIndex ? '#FF0000' : '#36364F' : '#FFFFFF'},
                    ]}
                    onPress={() => onClick(subItem.empty, index, subIndex)}
                  >
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </View>
      <View style={Styles.description}>
        <View style={Styles.row}>
          <View
            style={[
              Styles.circle,
              {backgroundColor: '#36364F', marginRight: 8},
            ]}></View>
          <Text style={Styles.text}>Available</Text>
        </View>
        <View style={Styles.row}>
          <View
            style={[
              Styles.circle,
              {backgroundColor: '#FF0000', marginRight: 8},
            ]}></View>
          <Text style={Styles.text}>Selected</Text>
        </View>
        <View style={Styles.row}>
          <View
            style={[
              Styles.circle,
              {backgroundColor: '#FFFFFF', marginRight: 8},
            ]}></View>
          <Text style={Styles.text}>Reserved</Text>
        </View>
      </View>
      <Price
        price={price}
        titleButton={'Buy now'}
        onPress={() => uNavigation.navigate('ComboOptions', {
          movie_id: route.params?.movie_id,
          seat: seat,
          cinema_id: route.params?.cinema_id,
          openning_day: route.params?.openning_day,
          show_time: route.params?.show_time,
          price: movie.price
        })}
        disabled={button}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  seat: {
    height: 24,
    width: 24,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    alignItems: 'center',
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default Seats;
