import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Payment = ({route}) => {
  const uNavigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [cinema, setCinema] = useState({});
  const [openningDay, setOpenningDay] = useState([]);
  const [showTime, setShowTime] = useState([]);
  const [seat, setSeat] = useState([]);
  const [total, setTotal] = useState(0);
  const [combos, setCombos] = useState([]);

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

  const getCinemaFromApi = (id) => {
    return fetch(`https://spidercinema.pmandono.com/api/cinema/${id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getCombosFromApi = (id) => {
    return fetch(`https://spidercinema.pmandono.com/api/combo`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  async function postJSON() {
    try {
      const response = await fetch("https://spidercinema.pmandono.com/api/ticket", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            movie_id: movie.id,
            number_tickets: 1,
            seat: `${seat[0]},${seat[1]}`,
            cinema_id: cinema.id,
            openning_day: route.params?.openning_day,
            show_time: route.params?.show_time,
            vat: 5,
            combo_id: route.params?.combo_id,
            number_combos: route.params?.number_combos
          }
        ),
      });
  
      const result = await response.json();
      console.log("Success:", result);
      // uNavigation.popToTop();
      uNavigation.navigate('Tabs', {screen: 'Tickets', params: {refresh: true}});
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const onClick = () => {
    postJSON();
  }

  useEffect(() => {
    const getMovie = async (id) => {
      setMovie(await getMovieFromApi(id));
    }
    const getCinema = async (id) => {
      setCinema(await getCinemaFromApi(id));
    }
    const getCombos = async () => {
      setCombos(await getCombosFromApi());
    }
    getMovie(route.params?.movie_id);
    getCinema(route.params?.cinema_id);
    getCombos();
    if(route.params?.openning_day){
      setOpenningDay(route.params?.openning_day.split('-'))
    }
    if(route.params?.show_time){
      setShowTime(route.params?.show_time.split(':'))
    }
    if(route.params?.seat){
      setSeat(route.params?.seat)
    }
    if(route.params?.price){
      setTotal(route.params?.price)
    }
    console.log('movie_id',':',movie.id);
    console.log('number_tickets',':',1);
    console.log('seat',':',seat);
    console.log('cinema_id',':',cinema.id);
    console.log('openning_day',':',route.params?.openning_day);
    console.log('show_time',':',route.params?.show_time);
    console.log('vat',':',5);
    console.log('combo_id',':',route.params?.combo_id);
    console.log('number_combos',':',route.params?.number_combos);
  }, [
    route.params?.movie_id,
    route.params?.seat,
    route.params?.cinema_id,
    route.params?.openning_day,
    route.params?.show_time,
    route.params?.combo_id,
    route.params?.number_combos,
    route.params?.price,
    route.params?.price_combo
  ]);
  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} />
      <View style={Styles.r}>
        <Image
          style={Styles.image}
          source={movie.image ? {uri: movie.image} : require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')}
        />
        <View style={{paddingLeft: 16}}>
          <Text style={[Styles.text, Styles.b]}>
            {movie.name}
          </Text>
          <Text style={Styles.text}>{openningDay[2]} - {openningDay[1]} - {(new Date).getFullYear()}</Text>
          <Text style={Styles.text}>{showTime[0]} : {showTime[1]}</Text>
          <Text style={Styles.text}>{cinema.name}</Text>
          <Text style={Styles.text}>Row {seat[0]} - Col {seat[1]}</Text>
          <Text style={[Styles.text, Styles.b]}>Total: {Math.floor(total * 1.05)} VND</Text>
        </View>
      </View>
      <ScrollView>
        <Text style={Styles.title}>Ticket information</Text>
        <View style={{paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8}}>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Ticket</Text>
            <Text style={Styles.text}>x1</Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Price</Text>
            <Text style={Styles.text}>{Math.floor(movie.price)} VND</Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Combo</Text>
            <Text style={Styles.text}>{route.params?.number_combos == null ? 0 : route.params?.number_combos}</Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Price</Text>
            <Text style={Styles.text}>{route.params?.price_combo} VND</Text>
          </View>
        </View>
        <Text style={Styles.title}>Add combo</Text>
        <FlatList 
          data={combos ? combos : []}
          renderItem={({item}) => {
            return (
              <Pressable
                style={[
                  Styles.r,
                  {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    marginVertical: 16,
                    marginLeft: 16,
                    width: 72 + 16 + 128,
                    borderRadius: 8,
                  },
                ]}
                onPress={() => uNavigation.goBack()}
              >
                <Image
                  style={Styles.comboImage}
                  source={require('../assets/img/combo.jpeg')}
                />
                <View style={{justifyContent: 'space-between', padding: 8}}>
                  <View
                    style={[
                      Styles.r,
                      {width: 128, justifyContent: 'space-between'},
                    ]}>
                    <Text style={[Styles.text, {fontSize: 16}]}>{item.name}</Text>
                    <Ionicons name="add" size={24} color={'#FFFFFF'} />
                  </View>
                  <Text style={[Styles.text, Styles.b]}>{Math.floor(item.price)} VND</Text>
                </View>
              </Pressable>
            )
          }}
          keyExtractor={item => item.id}
          horizontal={true}
        />
        <Text style={Styles.title}>Summary</Text>
        <View style={{paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8}}>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Total no VAT</Text>
            <Text style={Styles.text}>{Math.floor(total)} VND</Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>VAT</Text>
            <Text style={Styles.text}>5 %</Text>
          </View>
          <View style={[Styles.r, {justifyContent: 'space-between'}]}>
            <Text style={Styles.text}>Total</Text>
            <Text style={Styles.text}>{Math.floor(total * 1.05)} VND</Text>
          </View>
        </View>
        <Text style={Styles.title}>Payment</Text>
        <View style={Styles.r}>
          <Image
            style={[Styles.comboImage, {marginVertical: 16, marginLeft: 16}]}
            source={require('../assets/img/combo.jpeg')}
          />
          <Image
            style={[Styles.comboImage, {marginVertical: 16, marginLeft: 16}]}
            source={require('../assets/img/combo.jpeg')}
          />
        </View>
        <Text
          style={[
            Styles.text,
            {paddingLeft: 16, fontStyle: 'italic', textAlign: 'center'},
          ]}>
          I agree to the terms and conditions.
        </Text>
        <PrimaryButton value={'Pay now'} customStyle={Styles.button} onPress={() => onClick()}/>
      </ScrollView>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  r: {
    flexDirection: 'row',
  },
  image: {
    height: 172,
    width: 128,
  },
  text: {
    color: '#FFFFFF',
    paddingBottom: 8,
  },
  b: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    paddingVertical: 16,
    paddingLeft: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
});

export default Payment;
