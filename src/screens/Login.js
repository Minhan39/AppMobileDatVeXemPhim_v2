import React, {useState, useContext, useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
  Image,
  ToastAndroid,
  Pressable,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../services/UserContext';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Logo from '../components/Logo';
import EyeButton from '../components/EyeButton';
import BoxTextInput from '../components/BoxTextInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import {IsEmail} from '../utils/Logic';

const Login = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(UserContext);

  const SignInGoogle = data => {
    firestore()
      .collection('Users')
      .where('email', '==', data.email)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);

        if (querySnapshot.size === 0) {
          ToastAndroid('Register for profile, please!');
          navigation.navigate('Register');
          return;
        }

        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
          console.log('GOOD LOGIN>>>>>>>>>>>>>>>>>>');

          postJsonToApi(2, documentSnapshot.data(), documentSnapshot.id);
        });
      })
      .catch(error => {
        console.error('Error getting users: ', error);
      });
  };

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  // Function to handle hide password
  const onChangeHidePassword = () => {
    setHidePassword(hidePassword ? false : true);
  };

  // Function to handle login button
  const onTabs = () => {
    postJsonToApi(1, null);
  };

  async function postJsonToApi(action, firebaseData, firebaseId) {
    if (action == 2) {
      setIsLoading(true);
      try {
        const response = await fetch('https://anpm.io.vn/api/login', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: firebaseData.email,
            password: firebaseData.password,
          }),
        });

        const result = await response.json();
        console.log('Success:', result);
        if (result.message == 'Login Success') {
          context.getAvatar(firebaseId).then(value => {
            const obj = {
              email: result.user.email,
              email_verified_at: result.user.email_verified_at,
              id: result.user.id,
              name: result.user.name,
              profile_photo_path: value,
              firebase_id: firebaseId,
            };
            const jsonValue = JSON.stringify(obj);
            context.setUser(obj);
            AsyncStorage.setItem('USER', jsonValue);
            // Navigate to Tabs
            navigation.navigate('Tabs');
            setIsLoading(false);
          });
        } else {
          // set error message on screen
          setMessage(result.message);
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error get api:', error);
      }
    }

    if (action == 1) {
      // Check email validation
      if (!IsEmail(email)) {
        setMessage('email');
        return;
      }

      if (password === '') {
        setMessage('password');
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('https://anpm.io.vn/api/login', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const result = await response.json();
        console.log('Success:', result);
        if (result.message == 'Login Success') {
          // save user in async storage
          const storeDataAsyncStorage = async () => {
            try {
              firestore()
                .collection('Users')
                .where('email', '==', email)
                .get()
                .then(querySnapshot => {
                  console.log('Total users: ', querySnapshot.size);

                  querySnapshot.forEach(documentSnapshot => {
                    console.log(
                      'User ID: ',
                      documentSnapshot.id,
                      documentSnapshot.data(),
                    );
                    context.getAvatar(documentSnapshot.id).then(value => {
                      const obj = {
                        email: result.user.email,
                        email_verified_at: result.user.email_verified_at,
                        id: result.user.id,
                        name: result.user.name,
                        profile_photo_path: value,
                        firebase_id: documentSnapshot.id,
                      };
                      const jsonValue = JSON.stringify(obj);
                      context.setUser(obj);
                      AsyncStorage.setItem('USER', jsonValue);
                    });
                  });
                })
                .catch(error => {
                  console.error('Error get user in firestore:', error);
                });
            } catch (e) {
              console.error('Error save user in async storage:', e);
            }
          };
          storeDataAsyncStorage();
          // Navigate to Tabs
          navigation.navigate('Tabs');
          setIsLoading(false);
        } else {
          // set error message on screen
          setMessage(result.message);
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error get api:', error);
      }
    }
  }

  useMemo(() => {
    GoogleSignin.configure({
      webClientId:
        '955326349855-g5u9hfqkjes5v2qv3t0k013vpia641pa.apps.googleusercontent.com',
    });
  }, []);

  return isLoading ? (
    <View>
      <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
      <Text style={{fontSize: 16, textAlign: 'center'}}>Login...</Text>
    </View>
  ) : (
    <KeyboardAvoidingView style={Styles.container} behavior={'height'}>
      <ScrollView>
        <Logo />
        <View>
          <BoxTextInput
            placeholder={'Enter your email...'}
            width={'100%'}
            value={email}
            title={'Email'}
            onChangeText={newEmail => setEmail(newEmail)}
            message={message === 'email' ? 'Your email is not valid' : ''}
          />
          <BoxTextInput
            placeholder={'Enter your password...'}
            width={'100%'}
            title={'Password'}
            right={
              <EyeButton
                icon={hidePassword ? 'eye' : 'eye-slash'}
                onChangeHidePassword={onChangeHidePassword}
              />
            }
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={newPassword => setPassword(newPassword)}
            message={
              message === 'password'
                ? 'Your password is not null'
                : message === 'Unauthorized Error'
                ? 'Your email or password is incorrect'
                : message === 'Email not verified'
                ? 'Please verify your email'
                : ''
            }
          />
          <View style={{alignItems: 'flex-end', marginVertical: 8}}>
            <SecondaryButton
              buttonStyle={Styles.forgotButton}
              textStyle={Styles.forgotText}
              text={'Forgot Password?'}
            />
          </View>
          <PrimaryButton onPress={onTabs} value={'Sign In'} />
          <View style={{padding: 4, marginTop: 8}}>
            <Pressable
              style={{
                elevation: 4,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                height: 48,
                borderRadius: 8,
                flexDirection: 'row',
              }}
              onPress={() =>
                onGoogleButtonPress().then(data => {
                  console.log('Signed in with Google! ', data.user),
                    SignInGoogle(data.user);
                })
              }>
              <Image
                source={require('../assets/img/google.png')}
                style={{height: 32, width: 32, marginRight: 8}}
              />
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: 'Roboto',
                }}>
                Google Sign-In
              </Text>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}>
          <Text style={Styles.question}>Do you have an account?</Text>
          <SecondaryButton
            buttonStyle={Styles.registerButton}
            textStyle={Styles.registerText}
            text={'Register'}
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  form: {
    marginTop: 32,
  },
  question: {
    fontStyle: 'italic',
    color: '#000',
  },
  registerButton: {
    marginLeft: 8,
  },
  registerText: {
    color: '#537b2f',
    fontWeight: 'bold',
  },
  forgotButton: {},
  forgotText: {
    color: '#000',
    fontStyle: 'italic',
    fontFamily: 'Roboto',
  },
});

export default Login;
