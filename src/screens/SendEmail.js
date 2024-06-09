import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const SendEmail = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [tokenType, setTokenType] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
    if (route.params?.tokenType) {
      setTokenType(route.params.tokenType);
      console.log('token type ', route.params.tokenType);
    }
    if (route.params?.accessToken) {
      setAccessToken(route.params.accessToken);
      console.log('access token ', route.params.accessToken);
    }
  }, [route.params?.email, route.params?.tokenType, route.params?.accessToken]);

  async function postJsonToApi() {
    setIsLoading(true);
    try {
      const response = await fetch('https://anpm.io.vn/api/email/resend', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${tokenType} ${accessToken}`,
        },
      });

      const result = await response.json();
      console.log('Success:', JSON.stringify(result));

      if (result.message == 'Verification email resent.') {
        ToastAndroid.show('Check your email', ToastAndroid.LONG);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const onPress = () => {
    ToastAndroid.show('Email sent to your email address', ToastAndroid.LONG);
    postJsonToApi();
  };

  return isLoading ? (
    <ActivityIndicator size="large" color='#537b2f' style={{marginTop: 16}} />
  ) : (
    <View style={styles.container}>
      <Text style={{fontFamily: 'Roboto', fontSize: 24, color: '#000'}}>
        Verify your account
      </Text>
      <Text
        style={{
          fontFamily: 'Roboto',
          fontSize: 16,
          color: '#000',
          marginTop: 8,
          marginBottom: 32,
        }}>
        We have sent an email to <Text style={{color: '#537b2f'}}>{email}</Text>.
        Please check your email to verify your account.
      </Text>
      <PrimaryButton
        value={'Send Email'}
        onPress={() => onPress()}
        customStyle={{marginTop: 16, width: '100%'}}
      />
      <SecondaryButton
        buttonStyle={{marginTop: 16}}
        textStyle={{
          color: '#537b2f',
          fontWeight: 'bold',
          fontSize: 16,
          fontFamily: 'Roboto',
        }}
        text={'Go Back'}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
});

export default SendEmail;
