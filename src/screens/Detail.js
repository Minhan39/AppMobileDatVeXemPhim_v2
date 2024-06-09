import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('screen');

const Detail = ({route}) => {
  const uNavigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [studioes, setStudioes] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);

  const onClick = () => {
    // uNavigation.navigate('Options', {
    //   screen: 'TicketOptions',
    //   params: {movie_id: route.params?.movie_id},
    // })
    setPaused(true);
    setTimeout(() => {
      uNavigation.navigate('TicketOption', {
        movie_id: route.params?.movie_id,
      });
    }, 1000);
  };

  const getMovieFromApi = id => {
    return fetch(`https://anpm.io.vn/api/movie/${id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        console.log('PORTRAIT');
        setFullScreen(false);
      } else {
        console.log('LANDSCAPE');
        setFullScreen(true);
      }
    });
    if (route.params?.movie_id) {
      const getMovie = async () => {
        setIsLoading(true);
        try {
          const movie = await getMovieFromApi(route.params.movie_id);
          setMovie(movie);
          setActors(movie.actors.split(','));
          setDirectors(movie.directors.split(','));
          setStudioes(movie.studioes.split(','));
          movie.genres.unshift(movie.duration);
          setCategories(movie.genres);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      getMovie();
    }
  }, [route.params?.movie_id]);

  return isLoading ? (
    <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
  ) : (
    <SafeAreaView style={Styles.container}>
      {fullScreen ? null : <Header uNavigation={uNavigation} />}
      <StatusBar hidden={fullScreen} />
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={!fullScreen}>
        <View style={fullScreen ? Styles.fullScreenVideo : Styles.video}>
          <Video
            source={{
              uri: 'https://anpm.io.vn/public/storage/' + movie.trailer,
            }}
            controls
            resizeMode={'cover'}
            style={fullScreen ? Styles.fullScreenVideoV : Styles.video}
            paused={paused}
          />
        </View>
        <View style={Styles.title}>
          <Text style={Styles.name}>
            {movie.name}
            <Text style={{color: 'orange'}}> ({movie.rating_system_name})</Text>
          </Text>
          <View style={Styles.categories}>
            <FlatList
              data={categories ? categories : []}
              renderItem={({item}) => (
                <View style={Styles.category}>
                  <Text style={Styles.categoryText}>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index}
              horizontal={true}
            />
          </View>
        </View>
        <View style={Styles.information}>
          <Image
            source={
              movie.poster
                ? {uri: 'https://anpm.io.vn/public/storage/' + movie.poster}
                : require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')
            }
            style={Styles.image}
          />
          <Text style={Styles.description}>
            {movie.description
              ? `${movie.description.substring(0, 240)}...`
              : ''}
          </Text>
        </View>
        <View>
          <View style={Styles.informationRow}>
            <Text
              style={[Styles.whiteText, Styles.sWidth, {textAlign: 'right'}]}>
              Studio{studioes.length > 1 ? 's' : ''}
            </Text>
            {studioes.length > 1 ? (
              <FlatList
                scrollEnabled={false}
                data={studioes ? studioes : []}
                renderItem={({item}) => (
                  <Text style={[Styles.whiteText, Styles.subDescription]}>
                    {item}
                  </Text>
                )}
              />
            ) : (
              <Text style={[Styles.whiteText, Styles.subDescription]}>
                {studioes}
              </Text>
            )}
          </View>
          <View style={Styles.informationRow}>
            <Text
              style={[Styles.whiteText, Styles.sWidth, {textAlign: 'right'}]}>
              Director{directors.length > 1 ? 's' : ''}
            </Text>
            {directors.length > 1 ? (
              <FlatList
                scrollEnabled={false}
                data={directors ? directors : []}
                renderItem={({item}) => (
                  <Text style={[Styles.whiteText, Styles.subDescription]}>
                    {item}
                  </Text>
                )}
              />
            ) : (
              <Text style={[Styles.whiteText, Styles.subDescription]}>
                {directors}
              </Text>
            )}
          </View>
          <View style={Styles.informationRow}>
            <Text
              style={[Styles.whiteText, Styles.sWidth, {textAlign: 'right'}]}>
              Actors
            </Text>
            <FlatList
              scrollEnabled={false}
              data={actors ? actors : []}
              renderItem={({item}) => (
                <Text style={[Styles.whiteText, Styles.subDescription]}>
                  {item}
                </Text>
              )}
            />
          </View>
        </View>
      </ScrollView>
      {fullScreen ? null : (
        <View style={Styles.footer}>
          <PrimaryButton
            disabled={isLoading}
            value={'Buy ticket'}
            customStyle={Styles.button}
            onPress={() => onClick()}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  video: {
    width: width,
    height: width * 0.5625,
  },
  title: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  categories: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    width: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.07)',
    marginRight: 8,
  },
  categoryText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
  },
  information: {
    paddingTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  image: {
    height: 192,
    width: 128,
    borderRadius: 8,
  },
  description: {
    color: '#000',
    flexWrap: 'wrap',
    width: width - 128 - 16 * 2,
    paddingLeft: 8,
    fontSize: 16,
    fontWeight: '300',
  },
  informationRow: {
    paddingTop: 8,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  whiteText: {
    color: '#000',
    fontSize: 16,
  },
  sWidth: {
    width: 136,
    paddingRight: 16,
    fontWeight: '300',
  },
  footer: {
    backgroundColor: 'rgba(1,1,1,0)',
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 0,
    marginBottom: 8,
  },
  subDescription: {
    // backgroundColor: '#000',
    flexWrap: 'wrap',
    width: width - 128 - 16 * 2,
  },
  fullScreenVideo: {
    position: 'relative',
    flex: 1,
    width: height,
    height: width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullScreenVideoV: {
    flex: 1,
    width: height,
    height: width
  },
});

export default Detail;
