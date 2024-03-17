import React, { useEffect, useState } from 'react';
import {
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

  const getCombosFromApi = () => {
    return fetch(`https://spidercinema.pmandono.com/api/combo`)
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
    if(choose.length > 0 && choose[0] == id && choose[1] > 1){
      setChoose([id, choose[1] - 1]);
      setPrice(Number(price) - Number(p));
    }
    else
    if(choose.length > 0 && choose[0] == id && choose[1] == 1){
      setChoose([]);
      setPrice(route.params?.price);
    }
  }

  const onAdd = (id, p) => {
    //console.log(p, price);
    if(choose.length > 0 && choose[0] == id){
      setChoose([id, choose[1] + 1]);
      setPrice(Number(price) + Number(p));
    }
    else{
      setChoose([id, 1]);
      setPrice(Number(route.params?.price) + Number(p));
    }
  }

  useEffect(() => {
    const getCombos = async () => {
      setCombos(await getCombosFromApi());
    }
    getCombos();
    if(route.params?.price){
      setPrice(route.params?.price);
    }
    console.log(route.params?.movie_id);
    console.log(route.params?.seat);
    console.log(route.params?.cinema_id);
    console.log(route.params?.openning_day);
    console.log(route.params?.show_time);
    console.log(route.params?.price);
  }, [
    route.params?.movie_id,
    route.params?.seat,
    route.params?.cinema_id,
    route.params?.openning_day,
    route.params?.show_time,
    route.params?.price
  ])
  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} />
      <FlatList
        data={combos ? combos : []}
        renderItem={({item}) => (
          <View style={Styles.item}>
            <Image
              style={Styles.image}
              source={require('../assets/img/combo.jpeg')}
            />
            <View style={Styles.bodyItem}>
              <View style={Styles.headerItem}>
                <Text style={[Styles.text, {fontWeight: 'bold', textTransform: 'uppercase'}]}>
                  {item.name}
                </Text>
                <View style={Styles.num}>
                  <Pressable style={Styles.button} onPress={() => onRemove(item.id, item.price)}>
                    <Ionicons name="remove" size={24} color={'#FFFFFF'} />
                  </Pressable>
                  <Text style={[Styles.text, {marginHorizontal: 8}]}>
                    {choose.length > 0 && item.id == choose[0] ? choose[1] : item.num}
                  </Text>
                  <Pressable style={Styles.button} onPress={() => onAdd(item.id, item.price)}>
                    <Ionicons name="add" size={24} color={'#FFFFFF'} />
                  </Pressable>
                </View>
              </View>
              <FlatList 
                data={item.description ? item.description : []}
                renderItem={({item}) => (<Text style={Styles.text}>{item}</Text>)}
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Price 
        price={Math.floor(price)} 
        titleButton={'Checkout'} 
        onPress={() => uNavigation.navigate('Payment', {
          movie_id: route.params?.movie_id,
          seat: route.params?.seat,
          cinema_id: route.params?.cinema_id,
          openning_day: route.params?.openning_day,
          show_time: route.params?.show_time,
          price: price,
          combo_id: choose.length > 0 ? choose[0] : null,
          number_combos: choose.length > 0 ? choose[1] : null,
          price_combo: Number(price) - Number(route.params?.price)
        })}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  image: {
    width: 128,
    height: 128,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  bodyItem: {
    paddingLeft: 16,
    paddingTop: 16,
    width: width - 160,
  },
  text: {
    color: '#000000',
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
  },
  button: {
    backgroundColor: '#171723',
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComboOptions;
