import {React, useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../services/UserContext';

const Home = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState('');
  const context = useContext(UserContext);

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

  const getMoviesFromApi = () => {
    return fetch('https://anpm.io.vn/api/movies')
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useMemo(() => {
    setIsLoading(true);
    try {
      const getCategories = async () => {
        setCategories(await getCategoriesFromApi());
      };
      const getMovies = async () => {
        setMovies(await getMoviesFromApi());
      };
      getCategories();
      getMovies();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setAvatar(context.user?.profile_photo_path ?? "");
  }, [context.user]);

  const Header = ({navigation}) => {
    return (
      <View style={Styles.header}>
        <Pressable
          style={Styles.search}
          onPress={() => navigation.navigate('Search')}>
          <FontAwesome name={'search'} size={16} color={'rgba(0,0,0,0.7)'} />
          <Text style={Styles.searchText}>Find your favorite movie</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Account')}>
          <Image
            source={
              avatar === '' || avatar === null
                ? require('../assets/img/avatar.png')
                : {uri: avatar}
            }
            style={Styles.avatar}
          />
        </Pressable>
      </View>
    );
  };
  const Categories = ({navigation}) => {
    const CategoryItem = ({image, name, id}) => {
      return (
        <Pressable
          style={Styles.category}
          onPress={() =>
            navigation.navigate('MovieList', {category_id: id, title: name})
          }>
          {image == '' ? (
            <View></View>
          ) : (
            <Image source={{uri: image}} style={{width: 36, height: 36}} />
          )}
          <Text
            style={{
              color: '#000',
              fontSize: name.length >= 10 ? 10 : 11,
              fontWeight: '500',
            }}>
            {name}
          </Text>
        </Pressable>
      );
    };
    return (
      <View>
        <View style={Styles.categoriesHeader}>
          <Text style={Styles.label}>MOVIE GENRES</Text>
          <Pressable onPress={() => navigation.navigate('Category')}>
            <Text style={{color: '#537b2f', fontSize: 16}}>SHOW ALL</Text>
          </Pressable>
        </View>
        <FlatList
          style={{marginVertical: 4, height: 80}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={categories ? categories.slice(0, 6) : []}
          renderItem={({item}) => (
            <CategoryItem
              image={'https://cdn-icons-png.flaticon.com/512/2503/2503508.png'}
              name={item.name}
              id={item.id}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };
  const Movies = ({navigation}) => {
    return (
      <View>
        <View style={Styles.title}>
          <Text style={Styles.label}>Top Trading</Text>
        </View>
        <View style={Styles.slideshow}>
          <Pressable
            onPress={() =>
              navigation.navigate('Detail', {
                movie_id: movies ? movies[0].movie_id : 0,
              })
            }>
            <Image
              style={Styles.slide}
              source={
                movies[0]
                  ? {
                      uri:
                        'https://anpm.io.vn/public/storage/' +
                        movies[0].movie_poster,
                    }
                  : require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')
              }
            />
            <Text style={Styles.rating_slide}>
              {movies[0] ? movies[0].rating_system_name : ''}
            </Text>
          </Pressable>
        </View>
        <View style={Styles.title}>
          <Text style={Styles.label}>Currently showing movies</Text>
        </View>
        <FlatList
          style={{paddingTop: 8}}
          horizontal={true}
          data={movies ? movies : []}
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('Detail', {movie_id: item.movie_id})
              }>
              <Image
                style={Styles.image}
                source={{
                  uri: 'https://anpm.io.vn/public/storage/' + item.movie_poster,
                }}
              />
              <Text style={Styles.rating}>{item.rating_system_name}</Text>
            </Pressable>
          )}
        />
        <View style={Styles.title}>
          <Text style={Styles.label}>Upcoming movies</Text>
        </View>
        <FlatList
          style={{paddingTop: 8}}
          horizontal={true}
          data={movies ? movies.slice(0, 2) : []}
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('Detail', {movie_id: item.movie_id})
              }>
              <Image
                style={Styles.image}
                source={{
                  uri: 'https://anpm.io.vn/public/storage/' + item.movie_poster,
                }}
              />
              <Text style={Styles.rating}>{item.rating_system_name}</Text>
            </Pressable>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={Styles.container}>
      <ScrollView>
        <Header navigation={navigation} />
        {isLoading ? (
          <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
        ) : (
          <View>
            <Categories navigation={navigation} />
            <Movies navigation={navigation} />
            <View style={{height: 8}}></View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#537b2f',
    paddingVertical: 16,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '84%',
    paddingLeft: 16,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#FFF',
  },
  searchText: {
    fontSize: 14,
    paddingLeft: 8,
    color: 'rgba(0,0,0,0.7)',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  avatar: {
    height: 40,
    width: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 24,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: 72,
    height: 72,
    marginLeft: 8,
    backgroundColor: '#FFF',
    elevation: 4,
  },
  slide: {
    width: 272,
    height: 400,
    borderRadius: 8,
  },
  slideshow: {
    paddingTop: 8,
    alignItems: 'center',
  },
  title: {
    paddingLeft: 16,
  },
  image: {
    width: 88,
    height: 128,
    borderRadius: 8,
    marginLeft: 8,
  },
  rating_slide: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFD700',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 4,
    width: 48,
    textAlign: 'center',
    borderRadius: 4,
  },
  rating: {
    position: 'absolute',
    top: 4,
    left: 12,
    backgroundColor: '#FFD700',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 4,
    width: 32,
    textAlign: 'center',
    borderRadius: 4,
  },
  label: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
  },
});

export default Home;
