import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';

const {width, height} = Dimensions.get('screen');

const Detail = ({route}) => {
  const uNavigation = useNavigation();
  const [button, setButton] = useState(true);
  const [movie, setMovie] = useState({});

  const getMovieFromApi = () => {
    return fetch(`https://spidercinema.pmandono.com/api/movie/${route.params?.movie_id}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if(route.params?.movie_id){
      const getMovie = async () => {
        setMovie(await getMovieFromApi());
      }
      getMovie();
    }

    setTimeout(() => {
      setButton(false);
    }, 3000);
  }, [route.params?.movie_id]);

  return (
    <SafeAreaView style={Styles.container}>
      <Header uNavigation={uNavigation} />
      <ScrollView>
        <Video
          source={{
            uri: 'https://pmandono.com/doraemon_movie_utopia.mp4',
          }}
          controls
          resizeMode={'contain'}
          style={Styles.video}
          paused
        />
        <View style={Styles.title}>
          <Text style={Styles.name}>
            {movie.name}
          </Text>
          <View style={Styles.categories}>
            <FlatList
              data={movie.category_list ? movie.category_list : []}
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
            source={movie.image ? {uri: movie.image} : require('../assets/img/doraemon_vungdatlytuongtrenbautroi.jpg')}
            style={Styles.image}
          />
          <Text style={Styles.description}>
            {movie.description ? `${movie.description.substring(0, 310)}...` : ''}
          </Text>
        </View>
        <View>
          <View style={Styles.informationRow}>
            <Text style={[Styles.whiteText, Styles.sWidth]}>Studio</Text>
            <Text style={Styles.whiteText}>{movie.studio}</Text>
          </View>
          <View style={Styles.informationRow}>
            <Text style={[Styles.whiteText, Styles.sWidth]}>Director</Text>
            <Text style={Styles.whiteText}>{movie.director}</Text>
          </View>
          <View style={Styles.informationRow}>
            <Text style={[Styles.whiteText, Styles.sWidth]}>Actor</Text>
            <FlatList 
              data={movie.actor_list ? movie.actor_list : []}
              renderItem={({item}) => (
                <Text style={Styles.whiteText}>{item}</Text>
              )}
              keyExtractor={(item, index) => index}
              horizontal={false}
              scrollEnabled={false}
            />
          </View>
          <View style={Styles.informationRow}>
            <Text style={[Styles.whiteText, Styles.sWidth]}>Language</Text>
            <FlatList 
              data={movie.language_list ? movie.language_list : []}
              renderItem={({item}) => (
                <Text style={Styles.whiteText}>{item}</Text>
              )}
              keyExtractor={(item, index) => index}
              horizontal={false}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
      <View style={Styles.footer}>
        <PrimaryButton
          disabled={button}
          value={'Buy ticket'}
          customStyle={Styles.button}
          onPress={() => uNavigation.navigate('Options', {screen: 'TicketOptions', params: {movie_id: route.params?.movie_id}})}
        />
      </View>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(196, 196, 196, 0.07)',
    marginRight: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
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
    color: '#FFFFFF',
    flexWrap: 'wrap',
    width: width - 128 - 16 * 2,
    paddingLeft: 8,
  },
  informationRow: {
    paddingTop: 8,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  sWidth: {
    width: 150,
  },
  footer: {
    backgroundColor: 'rgba(1,1,1,0)',
  },
  button: {
    marginTop: 0,
    marginBottom: 8,
  },
});

export default Detail;
