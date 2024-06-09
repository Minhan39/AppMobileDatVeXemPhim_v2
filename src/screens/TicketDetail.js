import React, {useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Header from '../components/Header';
import {convertDate, convertTime2} from '../utils/Logic';

const {width, height} = Dimensions.get('screen');

const TicketDetail = ({route}) => {
  const uNavigation = useNavigation();

  useEffect(() => {
    console.log('MOVE TO TICKET DETAIL SCREEN');
    console.log('cinema name: ', route.params?.cinema_name);
    console.log('screening date: ', route.params?.screening_date);
    console.log('screening time: ', route.params?.screening_time);
    console.log('ticket id: ', route.params?.id);
    console.log('movie image url: ', route.params?.movie_image);
    console.log('color background: ', route.params?.color_background);
    console.log('color text: ', route.params?.color_text);
  }, [
    route.params?.cinema_name,
    route.params?.screening_date,
    route.params?.screening_time,
    route.params?.id,
    route.params?.movie_image,
    route.params?.color_background,
    route.params?.color_text,
  ]);

  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'Ticket detail'} />
      <View style={{flex: 1, justifyContent: 'space-around'}}>
        <View style={Styles.item}>
          <View
            style={{
              ...Styles.information,
              backgroundColor: `rgba(${route.params?.color_background}, 1)`,
            }}>
            <View style={Styles.center}>
              <Text style={Styles.title}>Cinema</Text>
              <Text
                style={[Styles.text, {color: `${route.params?.color_text}`}]}>
                {route.params?.cinema_name}
              </Text>
            </View>
            <View style={Styles.center}>
              <Text style={Styles.title}>Date</Text>
              <Text
                style={[Styles.text, {color: `${route.params?.color_text}`}]}>
                {convertDate(new Date(route.params?.screening_date))}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={Styles.center}>
                <Text style={Styles.title}>Time</Text>
                <Text
                  style={[Styles.text, {color: `${route.params?.color_text}`}]}>
                  {convertTime2(route.params?.screening_time)}
                </Text>
              </View>
              <View style={Styles.center}>
                <Text style={Styles.title}>Seats</Text>
                <Text
                  style={[
                    Styles.text,
                    {
                      color: `${route.params?.color_text}`,
                      fontSize: 12,
                      flexWrap: 'wrap',
                      width: 68,
                    },
                  ]}>
                  {route.params?.seats}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              borderStyle: 'dashed',
              borderColor: `rgba(${route.params?.color_background}, 1)`,
              borderTopWidth: 3,
              width: (width * 3) / 5,
            }}></View>
          <ImageBackground
            source={
              route.params?.movie_image
                ? {
                    uri:
                      'https://anpm.io.vn/public/storage/' +
                      route.params?.movie_image,
                  }
                : require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')
            }
            style={Styles.image}
            imageStyle={{
              borderRadius: 8,
            }}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              colors={[
                `rgba(${route.params?.color_background}, 1)`,
                `rgba(${route.params?.color_background}, 0)`,
              ]}
              style={Styles.image}></LinearGradient>
            <View style={Styles.circle1}></View>
            <View style={Styles.circle2}></View>
            <View
              style={{
                position: 'absolute',
                width: (width * 3) / 5,
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={Styles.qr}>
                <QRCode value={`${route.params?.id}`} size={120} />
              </View>
            </View>
          </ImageBackground>
        </View>
        <View></View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  item: {
    marginHorizontal: width / 5,
    elevation: 4,
  },
  information: {
    width: (width * 3) / 5,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  image: {
    height: 300,
    width: (width * 3) / 5,
  },
  circle1: {
    backgroundColor: '#FFF',
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: -21,
    left: -21,
  },
  circle2: {
    backgroundColor: '#FFF',
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: -21,
    right: -21,
  },
  qr: {
    backgroundColor: '#FFFFFF',
    width: 152,
    height: 152,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

export default TicketDetail;
