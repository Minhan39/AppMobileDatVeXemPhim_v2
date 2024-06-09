import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';

const {width, height} = Dimensions.get('screen');

const MovieList = ({route}) => {
  const uNavigation = useNavigation();
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getMoviesFromApi = () => {
    return fetch(`https://anpm.io.vn/api/movies`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (route.params?.category_id) {
      const getMovies = async () => {
        setIsLoading(true);
        try {
          const movie_list = await getMoviesFromApi();
          const movie_list_order_by_id = movie_list.filter(movie => {
            const itemData = `${movie.genre_ids}`;
            return (
              itemData.indexOf(`,${route.params.category_id},`) > -1 ||
              itemData.startsWith(`${route.params.category_id},`) ||
              itemData.endsWith(`,${route.params.category_id}`) ||
              itemData === `${route.params.category_id}`
            );
          });
          setMovies(movie_list_order_by_id);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      getMovies();
      // console.log('genre id: ', route.params.category_id);
    }
    if (route.params?.title) {
      setTitle(route.params.title);
    }
  }, [route.params?.category_id, route.params?.title]);

  return isLoading ? (
    <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
  ) : (
    <View style={Styles.container}>
      <Header uNavigation={uNavigation} title={title + ' MOVIES'} />
      {movies.length > 0 ? (
        <FlatList
          style={{paddingTop: 16}}
          data={movies ? movies : []}
          renderItem={({item}) => (
            <Pressable
              style={Styles.item}
              onPress={() =>
                uNavigation.navigate('Detail', {movie_id: item.movie_id})
              }>
              <Image
                source={{
                  uri: 'https://anpm.io.vn/public/storage/' + item.movie_poster,
                }}
                style={Styles.image}
              />
              <Text style={Styles.rating}>{item.rating_system_name}</Text>
            </Pressable>
          )}
          keyExtractor={item => item.movie_id}
          numColumns={2}
          horizontal={false}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 16}}>
            There is no movie in this category
          </Text>
        </View>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  item: {
    marginBottom: 12,
  },
  image: {
    width: width / 2 - 18,
    height: (width / 2 - 18) * 1.5,
    borderRadius: 8,
  },
  rating: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFD700',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 4,
    width: 40,
    textAlign: 'center',
    borderRadius: 4,
  },
});

export default MovieList;
