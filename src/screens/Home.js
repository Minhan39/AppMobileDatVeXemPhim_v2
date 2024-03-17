import {React, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Home = () => {
  const uNavigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  console.log(FontAwesome);

  const getCategoriesFromApi = () => {
    return fetch('https://spidercinema.pmandono.com/api/category')
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getMoviesFromApi = () => {
    return fetch('https://spidercinema.pmandono.com/api/category/movie')
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const getCategories = async () => {
      setCategories(await getCategoriesFromApi());
    };
    const getMovies = async () => {
      setMovies(await getMoviesFromApi());
    };
    getCategories();
    getMovies();
  }, []);

  const Header = ({uNavigation}) => {
    return (
      <View style={Styles.header}>
        <Pressable
          style={Styles.search}
          onPress={() => uNavigation.navigate('Search')}>
          <FontAwesome
            name={'search'}
            size={16}
            color={'rgba(255,255,255,0.7)'}
          />
          <Text style={Styles.searchText}>Find your favorite movie</Text>
        </Pressable>
        <View style={Styles.avatar}></View>
      </View>
    );
  };
  const Categories = ({uNavigation}) => {
    const CategoryItem = ({image, name, id}) => {
      return (
        <Pressable
          style={Styles.category}
          onPress={() => uNavigation.navigate('MovieList', {category_id: id})}>
          {image == '' ? (
            <View></View>
          ) : (
            <Image source={{uri: image}} style={{width: 36, height: 36}} />
          )}
          <Text
            style={{color: '#FFFFFF', fontSize: name.length >= 10 ? 10 : 11}}>
            {name}
          </Text>
        </Pressable>
      );
    };
    return (
      <View>
        <View style={Styles.categoriesHeader}>
          <Text style={{color: '#FFFFFF'}}>Movie categories</Text>
          <Pressable onPress={() => uNavigation.navigate('Category')}>
            <Text style={{color: '#0094FF'}}>show all</Text>
          </Pressable>
        </View>
        <FlatList
          horizontal={true}
          data={categories ? categories.slice(0, 6) : []}
          renderItem={({item}) => (
            <CategoryItem image={item.image} name={item.name} id={item.id} />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };
  const Movies = ({uNavigation}) => {
    return (
      <View>
        <View style={Styles.slideshow}>
          <Pressable
            onPress={() => uNavigation.navigate('Detail', {movie_id: 2})}>
            <Image
              style={Styles.slide}
              source={require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')}
            />
          </Pressable>
        </View>
        <FlatList
          data={categories ? categories.slice(0, 3) : []}
          renderItem={({item}) => (
            <View>
              <View style={Styles.title}>
                <Text style={Styles.titleText}>{item.name}</Text>
              </View>
              <FlatList
                data={movies[item.id] ? movies[item.id] : []}
                renderItem={({item}) => (
                  <Pressable
                    onPress={() =>
                      uNavigation.navigate('Detail', {movie_id: item.id})
                    }>
                    <Image style={Styles.image} source={{uri: item.image}} />
                  </Pressable>
                )}
                keyExtractor={item => item.id}
                horizontal
              />
            </View>
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={Styles.container}>
      <ScrollView>
        <Header uNavigation={uNavigation} />
        <Categories uNavigation={uNavigation} />
        <Movies uNavigation={uNavigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    width: 280,
    paddingLeft: 8,
    height: 32,
    borderRadius: 16,
  },
  searchText: {
    fontSize: 10,
    paddingLeft: 8,
    color: 'rgba(255,255,255,0.7)',
  },
  avatar: {
    height: 32,
    width: 32,
    backgroundColor: '#CCCCCC',
    borderRadius: 16,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: 72,
    height: 72,
    backgroundColor: 'rgba(196, 196, 196, 0.07)',
    marginLeft: 8,
  },
  slide: {
    width: 272,
    height: 400,
    borderRadius: 8,
  },
  slideshow: {
    paddingTop: 16,
    alignItems: 'center',
  },
  title: {
    paddingLeft: 16,
  },
  titleText: {
    color: '#FFFFFF',
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  image: {
    width: 88,
    height: 128,
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default Home;
