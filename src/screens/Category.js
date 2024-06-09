import {React, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';

const {width, height} = Dimensions.get('screen');

const Category = () => {
  const uNavigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCategoriesFromApi = () => {
    return fetch('https://anpm.io.vn/api/genres')
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      const getCategories = async () => {
        setCategories(await getCategoriesFromApi());
      };
      getCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
  ) : (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={'GENRES'} />
      <View style={{height: 16}} />
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <Pressable
            style={Styles.category}
            onPress={() =>
              uNavigation.navigate('MovieList', {
                category_id: item.id,
                title: item.name,
              })
            }>
            <View style={Styles.icon}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2503/2503508.png',
                }}
                style={{width: 48, height: 48}}
              />
            </View>
            <Text
              style={[
                Styles.name,
                {fontSize: item.name.length >= 10 ? 14 : 16},
              ]}>
              {item.name}
            </Text>
          </Pressable>
        )}
        keyExtractor={item => item.id}
        horizontal={false}
        numColumns={3}
        columnWrapperStyle={{justifyContent: 'space-evenly'}}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  category: {
    backgroundColor: '#FFF',
    width: (width * 0.9) / 3,
    height: (width * 0.9) / 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: (width * 0.1) / 4,
    elevation: 4,
  },
  icon: {
    backgroundColor: '#171723',
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: {
    color: '#000',
    fontWeight: '500',
  },
});

export default Category;
