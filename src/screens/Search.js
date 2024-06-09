import React, {useState, useEffect} from 'react';
import {ActivityIndicator,View, StyleSheet, Text, FlatList, Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BoxTextInput from '../components/BoxTextInput';
import SecondaryButton from '../components/SecondaryButton';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const uNavigation = useNavigation();

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

  useEffect(() => {
    const getMovie = async () => {
      setIsLoading(true);
      try{
        setMovies(await getMoviesFromApi());
      }
      catch(error){
        console.error(error);
      }
      finally{
        setIsLoading(false);
      }
    };
    getMovie();
  }, []);

  const MovieItem = ({image, name, id, rating}) => {
    return (
      <View style={{padding: 4}}>
        <Pressable
        style={Styles.movie}
        onPress={() => uNavigation.navigate('Detail', {movie_id: id})}>
        <Image style={Styles.image} source={{uri: image}} />
        <Text style={Styles.name}>
          {name}
          <Text style={Styles.rating}> {rating}</Text>
        </Text>
      </Pressable>
      </View>
    );
  };
  const onChangeSearch = text => {
    setSearchValue(text);
    const newData = movies.filter(item => {
      const itemData = `${item.movie_name.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
  };
  return (
    isLoading ? <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} /> :
    <View style={Styles.container}>
      <BoxTextInput
        autoFocus={true}
        width={'100%'}
        onChangeText={onChangeSearch}
        value={searchValue}
        placeholder={'Searching...'}
        right={
          <SecondaryButton
            buttonStyle={Styles.cancelButton}
            text={'CANCEL'}
            textStyle={Styles.cancelText}
            onPress={() => uNavigation.goBack()}
          />
        }
      />
      <FlatList
        data={data}
        renderItem={({item}) => (
          <MovieItem
            name={item.movie_name}
            id={item.movie_id}
            image={'https://anpm.io.vn/public/storage/' + item.movie_poster}
            rating={'(' + item.rating_system_name + ')'}
          />
        )}
        keyExtractor={item => item.movie_id}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  cancelText: {
    color: '#537b2f',
    fontSize: 16,
  },
  movie: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    elevation: 4,
    borderRadius: 8,
  },
  name: {
    color: '#000',
    fontSize: 16,
    paddingLeft: 16,
    flexWrap: 'wrap',
    flex: 1,
    fontWeight: '600',
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 4,
  },
  rating: {
    color: 'orange',
    fontSize: 14,
    fontWeight: 'normal',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    height: 48,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.5)',
  },
});

export default Search;
