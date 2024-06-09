import React, {useState} from 'react';
import {ActivityIndicator,View, StyleSheet, KeyboardAvoidingView, Text, ToastAndroid, Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Logo from '../components/Logo';
import EyeButton from '../components/EyeButton';
import BoxTextInput from '../components/BoxTextInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Checkbox from '../components/CheckBox';

const Register = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [disabledCheckbox, setDisabledCheckbox] = useState(true);
  const [message, setMessage] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeCheckbox = () => {
    setDisabledCheckbox(disabledCheckbox ? false : true);
  };
  const onChangeHidePassword = () => {
    setHidePassword(hidePassword ? false : true);
  };

  async function postJsonToApi() {
    try {
      const response = await fetch('https://anpm.io.vn/api/register', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: lastname + ' ' + firstname,
          password: password,
        }),
      });

      const result = await response.json();
      console.log('Success:', JSON.stringify(result));

      if (result.message == 'Register Success') {
        ToastAndroid.show('Register Success', ToastAndroid.LONG);
        navigation.navigate('SendEmail', {
          email: email,
          tokenType: result.token_type,
          accessToken: result.access_token,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onTabs = () => {
    if (firstname == '') {
      setMessage('firstname');
      return;
    } else if (lastname == '') {
      setMessage('lastname');
      return;
    } else if (email == '') {
      setMessage('email');
      return;
    } else if (email.includes('@') == false || email.includes('.') == false) {
      setMessage('formatEmail');
      return;
    } else if (password == '') {
      setMessage('password');
      return;
    } else if (password != rePassword) {
      setMessage('repassword');
      return;
    }

    setIsLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');

        firestore()
          .collection('Users')
          .add({
            name: lastname + ' ' + firstname,
            email: email,
            password: password,
          })
          .then(() => {
            console.log('User added!');

            postJsonToApi();
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  return (
    isLoading ? 
    <View>
      <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
      <Text style={{fontSize: 16, textAlign: 'center'}}>Register...</Text>
    </View>
    :
    <KeyboardAvoidingView style={Styles.container}>
      <ScrollView>
        <Logo />
        <View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'column', width: '49%'}}>
              <BoxTextInput
                placeholder={'Enter your firstname...'}
                title={'Firstname'}
                width={'100%'}
                value={firstname}
                onChangeText={newFirstname => setFirstname(newFirstname)}
                message={message == 'firstname' ? 'firstname can not null' : ''}
                isRequired={true}
              />
            </View>
            <View style={{flexDirection: 'column', width: '49%'}}>
              <BoxTextInput
                placeholder={'Enter your lastname...'}
                title={'Lastname'}
                width={'100%'}
                value={lastname}
                onChangeText={newLastname => setLastname(newLastname)}
                message={message == 'lastname' ? 'lastname can not null' : ''}
                isRequired={true}
              />
            </View>
          </View>
          <BoxTextInput
            placeholder={'Enter your email...'}
            title={'Email'}
            width={'100%'}
            value={email}
            onChangeText={newEmail => setEmail(newEmail)}
            message={
              message == 'email'
                ? 'email can not null'
                : message == 'formatEmail'
                ? 'email is not valid'
                : ''
            }
            isRequired={true}
          />
          <BoxTextInput
            placeholder={'Enter your password...'}
            title={'Password'}
            width={'100%'}
            secureTextEntry={hidePassword}
            right={
              <EyeButton
                icon={hidePassword ? 'eye-slash' : 'eye'}
                onChangeHidePassword={onChangeHidePassword}
              />
            }
            value={password}
            onChangeText={newPassword => setPassword(newPassword)}
            message={message == 'password' ? 'password can not null' : ''}
            isRequired={true}
          />
          <BoxTextInput
            placeholder={'Confirm your password...'}
            title={'Confirm password'}
            width={'100%'}
            secureTextEntry={hidePassword}
            right={
              <EyeButton
                icon={hidePassword ? 'eye-slash' : 'eye'}
                onChangeHidePassword={onChangeHidePassword}
              />
            }
            value={rePassword}
            onChangeText={newRePassword => setRePassword(newRePassword)}
            message={message == 'repassword' ? 'password is not match' : ''}
            isRequired={true}
          />
          <View style={Styles.agree}>
            <Checkbox onPress={onChangeCheckbox} disabled={disabledCheckbox} />
            <Text style={{color: '#000'}}>
              I agree to the terms and conditions.
            </Text>
          </View>
          <PrimaryButton
            value={'Register'}
            disabled={disabledCheckbox}
            onPress={onTabs}
          />
        </View>
        <View style={Styles.headerForm}>
          <SecondaryButton
            buttonStyle={Styles.loginButton}
            textStyle={Styles.loginText}
            text={'Go Back'}
            onPress={() => navigation.goBack()}
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
  headerForm: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  question: {
    fontStyle: 'italic',
    color: '#000',
    fontFamily: 'Roboto',
  },
  loginButton: {
    marginHorizontal: 4,
  },
  loginText: {
    color: '#537b2f',
    fontWeight: 'bold',
  },
  agree: {
    marginVertical: 8,
    flexDirection: 'row',
  },
});

export default Register;
