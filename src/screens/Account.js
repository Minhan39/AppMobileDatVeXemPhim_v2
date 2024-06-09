import React, {useEffect, useContext, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../services/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';

const Account = () => {
  const uNavigation = useNavigation();
  const context = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // handle logout
  const logout = () => {
    context.logout();
    uNavigation.navigate('Login');
  };

  const getPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Movie App gallery Permission',
          message:
            'Movie App needs access to your camera ' +
            'so you can get some images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the gallary');
        openImagePicker();
      } else {
        console.log('gallary permission denied');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log('Image URI: ', imageUri);

        Alert.alert('Notification', 'Do you want to save your avatar?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => onPress()},
        ]);
      }
    });
  };

  const onPress = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'No image selected, try again!');
      return;
    }
    setIsLoading(true);
    try {
      await storage()
        .ref(`images/${context.user.firebase_id}`)
        .putFile(selectedImage);
      console.log('upload successful');

      await context.updateAvatar(context.user.firebase_id);

      Alert.alert('Success', 'Your avatar has been updated!');
    } catch (error) {
      console.log('Error upload: ', error);
      Alert.alert('Error', 'Failed to upload avatar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Profile screen...');
    console.log('***User saved in async storage:', context.user);
    setAvatar(context.user?.profile_photo_path ?? '');
  }, [context.user]);

  return (
    <View style={Styles.container}>
      <View style={Styles.layout}>
        <View style={[Styles.row, {paddingBottom: 32, paddingLeft: 16}]}>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color='#537b2f'
              style={{position: 'absolute', zIndex: 99, top: 30, left: 46}}
            />
          )}
          {isLoading && (
            <View
              style={{
                ...Styles.avatar,
                backgroundColor: '#000',
                zIndex: 77,
                opacity: 0.5,
                position: 'absolute',
                top: 0,
                left: 16,
              }}></View>
          )}
          <Image
            source={
              avatar === '' || avatar === null
                ? require('../assets/img/avatar.png')
                : {uri: avatar}
            }
            style={Styles.avatar}
          />
          <Pressable
            style={{
              position: 'absolute',
              left: 80,
              top: 64,
              backgroundColor: '#537b2f',
              borderRadius: 60,
              padding: 6,
              zIndex: 88,
            }}
            onPress={() => getPermissions()}>
            <MaterialIcons name="edit" size={20} color={'#fff'} />
          </Pressable>
          <Text style={[Styles.text, {fontWeight: 'bold', fontSize: 20}]}>
            {context.user ? context.user.name : 'Unknown user'}
          </Text>
        </View>
        <View>
          <View style={{...Styles.row, ...Styles.button}}>
            <Zocial name="email" size={24} color={'#537b2f'} />
            <Text style={{...Styles.text, color: '#537b2f'}}>
              {context.user ? context.user.email : 'Unknow email'}
            </Text>
          </View>
          <Pressable
            style={{...Styles.row, ...Styles.button}}
            onPress={() => console.log('language click: ', context.user)}>
            <MaterialIcons name="language" size={24} color={'#000'} />
            <Text style={Styles.text}>
              Language{' '}
              <Text style={{fontStyle: 'italic', fontFamily: 'Roboto'}}>
                (coming soon)
              </Text>
            </Text>
          </Pressable>
          <Pressable style={{...Styles.row, ...Styles.button}} onPress={() => logout()}>
            <MaterialIcons name="logout" size={24} color={'#000'} />
            <Text style={Styles.text}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
  },
  text: {
    color: '#000',
    paddingLeft: 16,
    fontFamily: 'Roboto',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    elevation: 4,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8
  },
  layout: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
});

export default Account;
