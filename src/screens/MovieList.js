import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';

const {width, height} = Dimensions.get('screen');

const MovieList = ({route}) => {
  const uNavigation = useNavigation();
  const [movies, setMovies] = useState([]);

  const getMoviesFromApi = () => {
    return fetch(`https://spidercinema.pmandono.com/api/movie/category/${route.params?.category_id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if(route.params?.category_id){
      const getMovies = async () => {
        setMovies(await getMoviesFromApi());
      }
      getMovies();
      //console.log(movies);
    }
  }, [route.params?.category_id]);

  return (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} />
      <FlatList
        data={movies ? movies : []}
        renderItem={({item}) => (
          <Pressable
            style={Styles.item}
            onPress={() => uNavigation.navigate('Detail', {movie_id: item.id})}>
            <Image source={{uri:item.image}} style={Styles.image} />
          </Pressable>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        horizontal={false}
        columnWrapperStyle={{justifyContent: 'space-evenly'}}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  item: {
    marginTop: 12,
  },
  image: {
    width: width / 2 - 18,
    height: (width / 2 - 18) * 1.5,
    borderRadius: 8,
  },
});

export default MovieList;
