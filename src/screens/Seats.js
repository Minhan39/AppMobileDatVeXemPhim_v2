import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View, Text, ToastAndroid} from 'react-native';
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
  // const [seat, setSeat] = useState([]);
  const [seats_selected, setSeatsSelected] = useState([]);
  const [price, setPrice] = useState({});
  const [ticketPrice, setTicketPrice] = useState('0');
  const [hashSeat, setHashSeat] = useState([]);
  const [button, setButton] = useState(true);

  const getPriceFromApi = () => {
    return fetch(
      `https://anpm.io.vn/api/ticket-prices/${route.params?.cinema_id}`,
    )
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onClick = (enable, i, j) => {
    if (enable) {
      // setSeat([i, j]);
      let hash = [];
      for (let i = 0; i < seats_selected.length; i++) {
        hash[seats_selected[i]] = i;
      }
      if (hash[[i, j]] != undefined) {
        let tmp = [...seats_selected];
        tmp.splice(hash[[i, j]], 1);
        hash[[i, j]] = undefined;
        setSeatsSelected(tmp);
        // console.log('seats_selected: ', tmp);

        setTicketPrice(
          `${Math.round(price[0].price) * (seats_selected.length - 1)} ${
            price[0].unit_name
          }`,
        );
        if (seats_selected.length == 1) {
          setButton(true);
        }
      } else {
        if (seats_selected.length < 8) {
          // console.log('seats_selected: ', [...seats_selected, [i, j]]);
          setSeatsSelected([...seats_selected, [i, j]]);
          hash[[i, j]] = seats_selected.length;

          setTicketPrice(
            `${Math.round(price[0].price) * (seats_selected.length + 1)} ${
              price[0].unit_name
            }`,
          );
          setButton(false);
        } else {
          ToastAndroid.show(
            'You can only select 8 seats !',
            ToastAndroid.SHORT,
          );
        }
      }
      setHashSeat(hash);
    }
    // console.log(i, j, `${price[0].price} ${price[0].unit_name}`);
  };

  useEffect(() => {
    const getPrice = async () => {
      const price_api = await getPriceFromApi();
      setPrice(price_api);
      setTicketPrice(`0 ${price_api[0].unit_name}`);
    };
    if (route.params?.cinema_id) {
      getPrice();
    }
    console.log('MOVE TO SEAT SCREEN ...');
    console.log('showtime_id in seat: ', route.params?.showtime_id);
    console.log('cinema_id in seat: ', route.params?.cinema_id);
    setSeats(generateSeat());
  }, [route.params?.show_time, route.params?.cinema_id]);

  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'Pick your seat'}/>
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
                      {
                        backgroundColor: subItem.empty
                          ? hashSeat[[index, subIndex]] != undefined
                            ? '#537b2f'
                            : '#CCCCCC'
                          : '#171723',
                      },
                    ]}
                    onPress={() =>
                      onClick(subItem.empty, index, subIndex)
                    }></Pressable>
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
              {backgroundColor: '#CCC', marginRight: 8},
            ]}></View>
          <Text style={Styles.text}>Available</Text>
        </View>
        <View style={Styles.row}>
          <View
            style={[
              Styles.circle,
              {backgroundColor: '#537b2f', marginRight: 8},
            ]}></View>
          <Text style={Styles.text}>Selected</Text>
        </View>
        <View style={Styles.row}>
          <View
            style={[
              Styles.circle,
              {backgroundColor: '#171723', marginRight: 8},
            ]}></View>
          <Text style={Styles.text}>Reserved</Text>
        </View>
      </View>
      <Price
        price={ticketPrice}
        titleButton={'Buy now'}
        onPress={() =>
          uNavigation.navigate('ComboOptions', {
            seat: seats_selected,
            showtime_id: route.params?.showtime_id,
            price: price[0],
          })
        }
        disabled={button}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    color: 'rgba(0,0,0,0.7)',
    fontSize: 16,
    fontFamily: 'Roboto',
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
