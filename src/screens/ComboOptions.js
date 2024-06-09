import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import Price from '../components/Price';

const {width, height} = Dimensions.get('screen');

const ComboOptions = ({route}) => {
  const uNavigation = useNavigation();
  const [combos, setCombos] = useState([]);
  const [choose, setChoose] = useState([]);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getCombosFromApi = () => {
    return fetch(`https://anpm.io.vn/api/comboes`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onRemove = (id, p) => {
    //console.log(p,price);
    if (choose.length > 0 && choose[0] == id && choose[1] > 1) {
      setChoose([id, choose[1] - 1]);
      setPrice(Number(price) - Number(p));
    } else if (choose.length > 0 && choose[0] == id && choose[1] == 1) {
      setChoose([]);
      setPrice(route.params?.price.price * route.params?.seat.length);
    }
  };

  const onAdd = (id, p) => {
    //console.log(p, price);
    if (choose.length > 0 && choose[0] == id) {
      setChoose([id, choose[1] + 1]);
      setPrice(Number(price) + Number(p));
    } else {
      setChoose([id, 1]);
      setPrice(
        Number(route.params?.price.price * route.params?.seat.length) +
          Number(p),
      );
    }
  };

  useEffect(() => {
    const getCombos = async () => {
      try{
        setIsLoading(true);
        setCombos(await getCombosFromApi());
      }
      catch(error){
        console.error(error);
      }
      finally{
        setIsLoading(false);
      }
    };
    getCombos();
    if (route.params?.price) {
      setPrice(route.params?.price.price * route.params?.seat.length);
    }
    console.log('MOVE TO COMBO SCREEN ...');
    console.log('seat: ', route.params?.seat);
    console.log('showtime id: ', route.params?.showtime_id);
    console.log('price obj: ', route.params?.price);
  }, [route.params?.seat, route.params?.showtime_id, route.params?.price]);
  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'Good service for you'}/>
      {isLoading ? <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} /> :
      <FlatList
        style={{paddingTop: 8}}
        data={combos ? combos : []}
        renderItem={({item}) => (
          <View style={{padding: 4, marginBottom: 8}}>
          <View style={Styles.item}>
            <Image
              style={Styles.image}
              source={{uri: 'https://anpm.io.vn/public/storage/' + item.image}}
            />
            <View style={Styles.bodyItem}>
              <View style={Styles.headerItem}>
                <Text
                  style={[
                    Styles.text,
                    {fontFamily: 'roboto', fontWeight: 'bold', textTransform: 'uppercase'},
                  ]}>
                  Good service
                </Text>
                <View style={Styles.num}>
                  <Pressable
                    style={Styles.button}
                    onPress={() => onRemove(item.id, item.price)}>
                    <Ionicons name="remove" size={16} color={'#FFFFFF'} />
                  </Pressable>
                  <Text style={[Styles.text, {marginHorizontal: 8}]}>
                    {choose.length > 0 && item.id == choose[0]
                      ? choose[1]
                      : item.num}
                  </Text>
                  <Pressable
                    style={Styles.button}
                    onPress={() => onAdd(item.id, item.price)}>
                    <Ionicons name="add" size={16} color={'#FFFFFF'} />
                  </Pressable>
                </View>
              </View>
              <Text style={Styles.text}>{item.description}</Text>
              <Text style={Styles.text}>
                Price: {Math.round(item.price)} {item.unit_name}
              </Text>
            </View>
          </View>
          {item.id == 5 && <View style={Styles.hot}><Text style={{fontFamily: 'roboto', fontSize: 12, color: '#fff', fontWeight: 'bold'}}>NEW</Text></View>}
          </View>
        )}
        keyExtractor={item => item.id}
      /> }
      <Price
        price={Math.floor(price) + ' ' + route.params?.price.unit_name}
        titleButton={'Checkout'}
        disabled={isLoading}
        onPress={() =>
          uNavigation.navigate('Payment', {
            seat: route.params?.seat,
            showtime_id: route.params?.showtime_id,
            price: route.params?.price,
            combo:
              choose.length > 0
                ? combos.find(item => item.id == choose[0])
                : null,
            number_combos: choose.length > 0 ? choose[1] : null,
          })
        }
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    width: 128,
    height: 128,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 4,
  },
  bodyItem: {
    paddingTop: 16,
    width: width - 160,
  },
  text: {
    color: '#000000',
    fontFamily: 'roboto',
  },
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  num: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 16,
  },
  button: {
    backgroundColor: '#171723',
    height: 24,
    width: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hot: {
    backgroundColor: '#537b2f',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 12,
  },
});

export default ComboOptions;
