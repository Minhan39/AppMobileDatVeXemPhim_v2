import React, {useEffect, useState, useContext} from 'react';
import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {UserContext} from '../services/UserContext';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import {convertDate, convertTime} from '../utils/Logic';

const Payment = ({route}) => {
  const uNavigation = useNavigation();
  const context = useContext(UserContext);
  const [seat, setSeat] = useState([]);
  const [showtime, setShowtime] = useState([]);
  const [screeningDate, setScreeningDate] = useState();
  const [screeningTime, setScreeningTime] = useState();
  const [combo, setCombo] = useState();

  const getShowtimeFromApi = id => {
    return fetch(`https://anpm.io.vn/api/showtime/${id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };
  const sumTicketPrice = () => {
    return route.params?.price.price * route.params?.seat.length;
  };
  const sumComboPrice = () => {
    return combo ? combo.price * route.params?.number_combos : 0;
  };
  const convertSeat = seat => {
    const row_name = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'K',
      'L',
      'M',
      'N',
    ];
    let result = '';
    for (let i = 0; i < seat.length; i++) {
      result += row_name[seat[i][0]] + (seat[i][1] + 1);
      if (i < seat.length - 1) {
        result += ',';
      }
    }
    return result;
  };

  async function postJSON() {
    try {
      const response = await fetch('https://anpm.io.vn/api/ticket', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: context.user ? context.user.id : 1,
          showtime_id: route.params?.showtime_id,
          ticket_price_id: route.params?.price.id,
          voucher_id: null,
          gift_id: null,
          quantity: route.params?.seat.length,
          seats: seat,
          combos: combo ? `${combo.id}:${route.params?.number_combos}` : null,
          payment: 'undefine',
          reduced_price_by_voucher: null,
          reduced_price_by_point: null,
          reduced_price_by_gift: null,
        }),
      });

      const result = await response.json();
      console.log('Success:', result);
      // uNavigation.popToTop();
      uNavigation.navigate('Tabs', {
        screen: 'Tickets',
        params: {refresh: true},
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const onClick = () => {
    console.log('POSTING ...');
    postJSON();
  };

  useEffect(() => {
    const getShowtime = async id => {
      const showtime_api = await getShowtimeFromApi(id);
      setShowtime(showtime_api);
      const date_arr = showtime_api.screening_date.split('-');
      const time_arr = showtime_api.screening_time.split(':');
      setScreeningDate(
        convertDate(new Date(date_arr[0], date_arr[1] - 1, date_arr[2])),
      );
      setScreeningTime(
        convertTime(
          new Date(
            date_arr[0],
            date_arr[1] - 1,
            date_arr[2],
            time_arr[0],
            time_arr[1],
          ),
        ),
      );
    };
    if (route.params?.showtime_id) {
      getShowtime(route.params.showtime_id);
    }
    if (route.params?.combo) {
      setCombo(route.params?.combo);
    }
    if (route.params?.seat) {
      setSeat(convertSeat(route.params?.seat));
    }
    console.log('MOVE TO PAYMENT SCREEN ...');
    console.log('seat: ', route.params?.seat);
    console.log('showtime id: ', route.params?.showtime_id);
    console.log('price obj: ', route.params?.price);
    console.log('combo: ', route.params?.combo);
    console.log('number of combo: ', route.params?.number_combos);
  }, [
    route.params?.seat,
    route.params?.showtime_id,
    route.params?.price,
    route.params?.combo,
    route.params?.number_combos,
  ]);
  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'Your ticket'} />
      <View style={Styles.r}>
        <Image
          style={Styles.image}
          source={
            showtime.movie_poster
              ? {
                  uri:
                    'https://anpm.io.vn/public/storage/' +
                    showtime.movie_poster,
                }
              : require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')
          }
        />
        <View style={{paddingLeft: 16}}>
          <Text
            style={[Styles.text, Styles.b, {fontSize: 18}]}>
            {showtime.movie_name}
          </Text>
          <Text style={Styles.text}>
            {screeningDate}
            {/* {openningDay[2]} - {openningDay[1]} - {new Date().getFullYear()} */}
          </Text>
          <Text style={Styles.text}>
            {showtime.duration} - {screeningTime}
            {/* {showTime[0]} : {showTime[1]} */}
          </Text>
          <Text style={Styles.text}>{showtime.cinema_name}</Text>
          <Text style={Styles.text}>
            SEATS: {seat}
            {/* Row {seat[0]} - Col {seat[1]} */}
          </Text>
          <Text style={[Styles.text, {fontWeight: '900', fontSize: 18}]}>
            TOTAL: {sumTicketPrice() + sumComboPrice()}{' '}
            {route.params?.price.unit_name}
            {/* Total: {Math.floor(total * 1.05)} VND */}
          </Text>
        </View>
      </View>
      <ScrollView>
        <Text style={Styles.title}>TICKET INFORMATION</Text>
        <View style={{paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8}}>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Ticket number</Text>
            <Text style={Styles.text}>x{route.params?.seat.length}</Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Price for a ticket</Text>
            <Text style={Styles.text}>
              {Math.round(route.params?.price.price)}{' '}
              {route.params?.price.unit_name}
            </Text>
          </View>
          <View
            style={[
              Styles.r,
              {
                justifyContent: 'space-between',
                borderBottomWidth: 0.3,
                borderBottomColor: '#CCCCCC',
              },
            ]}>
            <Text style={Styles.text}>Total for tickets</Text>
            <Text style={Styles.text}>
              {sumTicketPrice()} {route.params?.price.unit_name}
            </Text>
          </View>
          <View
            style={[
              Styles.r,
              {justifyContent: 'space-between', paddingTop: 4},
            ]}>
            <Text style={Styles.text}>Combo detail</Text>
            <Text style={Styles.text}>
              {route.params?.combo ? route.params?.combo.description : 'None'}
            </Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Combo number</Text>
            <Text style={Styles.text}>
              x
              {route.params?.number_combos == null
                ? 0
                : route.params?.number_combos}
            </Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Price for a combo</Text>
            <Text style={Styles.text}>
              {Math.round(route.params?.combo ? route.params?.combo.price : 0)}{' '}
              {route.params?.combo ? route.params?.combo.unit_name : ''}
            </Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Total for comboes</Text>
            <Text style={Styles.text}>
              {sumComboPrice()}{' '}
              {route.params?.combo ? route.params?.combo.unit_name : ''}
            </Text>
          </View>
        </View>
        <Text style={Styles.title}>ADD COMBO</Text>
        <Pressable
          onPress={() => uNavigation.goBack()}
          style={Styles.comboButton}>
          <Text style={Styles.comboText}>Choose more combo!</Text>
        </Pressable>
        <Text style={Styles.title}>PAYMENT</Text>
        <View style={Styles.r}>
          <Image
            style={[Styles.payment_image, {marginVertical: 16, marginLeft: 16}]}
            source={require('../assets/img/paypal_logo.png')}
          />
          <Image
            style={[Styles.payment_image, {marginVertical: 16, marginLeft: 16}]}
            source={require('../assets/img/momo_logo.png')}
          />
        </View>
        <Text
          style={[
            Styles.text,
            {
              paddingLeft: 16,
              fontStyle: 'italic',
              textAlign: 'center',
              fontFamily: 'Roboto',
            },
          ]}>
          I agree to the terms and conditions.
        </Text>
        <View style={{paddingHorizontal: 16}}>
          <PrimaryButton
            value={'Pay now'}
            customStyle={Styles.button}
            onPress={() => onClick()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  r: {
    flexDirection: 'row',
  },
  image: {
    height: 172,
    width: 128,
  },
  text: {
    fontFamily: 'Roboto',
    color: '#000',
    paddingBottom: 8,
    fontSize: 16,
  },
  b: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: '#FFF',
    paddingVertical: 16,
    paddingLeft: 16,
    backgroundColor: '#537b2f',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  comboImage: {
    height: 72,
    width: 72,
    borderRadius: 8,
    marginVertical: 8,
    marginLeft: 8,
  },
  button: {
    marginTop: 0,
    marginBottom: 16,
  },
  comboButton: {
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  comboText: {
    color: '#000',
    fontFamily: 'Roboto',
  },
  payment_image: {
    height: 72,
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
});

export default Payment;
