import React, {useState} from 'react';
import {StyleSheet, Text, KeyboardAvoidingView, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Logo from '../components/Logo';
import EyeButton from '../components/EyeButton';
import BoxTextInput from '../components/BoxTextInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Message from '../components/Message';
import {IsVietNamPhoneNumber} from '../utils/Logic';

const Login = () => {
  const Form = () => {
    const HeaderForm = () => {
      const uNavigation = useNavigation();

      return (
        <View style={Styles.headerForm}>
          <Text style={Styles.question}>Do you have an account?</Text>
          <SecondaryButton
            buttonStyle={Styles.registerButton}
            textStyle={Styles.registerText}
            text={'Register'}
            onPress={() => uNavigation.navigate('Register')}
          />
        </View>
      );
    };
    const BodyForm = () => {
      const [hidePassword, setHidePassword] = useState(true);
      const [message, setMessage] = useState('');
      const [messageIcon, setMessageIcon] = useState('frown-o');
      const [phone, setPhone] = useState('');
      const [password, setPassword] = useState('');
      const uNavigation = useNavigation();

      const onChangeHidePassword = () => {
        setHidePassword(hidePassword ? false : true);
      };
      const onTabs = () => {
        if (IsVietNamPhoneNumber(phone)) {
          if (phone == '0394173864' && password == 'abcd@1234') {
            setMessage('Logout successfull');
            setMessageIcon('check');
            uNavigation.navigate('Tabs');
          } else {
            setMessage('Login fail');
            setMessageIcon('frown-o');
          }
        } else {
          setMessage('Your phone is not valid');
          setMessageIcon('frown-o');
        }
      };

      return (
        <View>
          <BoxTextInput
            placeholder={'Your phone'}
            width={294}
            value={phone}
            onChangeText={newPhone => setPhone(newPhone)}
          />
          <BoxTextInput
            placeholder={'Password'}
            width={270}
            right={
              <EyeButton
                icon={hidePassword ? 'eye-slash' : 'eye'}
                onChangeHidePassword={onChangeHidePassword}
              />
            }
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={newPassword => setPassword(newPassword)}
          />
          <Message
            message={message}
            height={message == '' ? 0 : 32}
            icon={messageIcon}
          />
          <PrimaryButton onPress={onTabs} value={'Sign In'} />
        </View>
      );
    };
    const FooterForm = () => {
      return (
        <View style={Styles.footerForm}>
          <SecondaryButton
            buttonStyle={Styles.forgotButton}
            textStyle={Styles.forgotText}
            text={'Forgot Password'}
          />
        </View>
      );
    };

    return (
      <View style={Styles.form}>
        <HeaderForm />
        <BodyForm />
        <FooterForm />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={Styles.container} behavior={'height'}>
      <ScrollView>
        <Logo />
        <Form />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171723',
    paddingTop: 64,
  },
  form: {
    marginTop: 32,
  },
  headerForm: {
    paddingLeft: 32,
    flexDirection: 'row',
    paddingBottom: 8,
  },
  question: {
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  registerButton: {
    marginLeft: 8,
  },
  registerText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  footerForm: {
    marginTop: 8,
    alignItems: 'center',
  },
  forgotButton: {},
  forgotText: {
    color: '#FFFFFF',
  },
});

export default Login;
