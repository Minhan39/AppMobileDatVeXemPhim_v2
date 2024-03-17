import React, {useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Logo from '../components/Logo';
import EyeButton from '../components/EyeButton';
import BoxTextInput from '../components/BoxTextInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Checkbox from '../components/CheckBox';
import Message from '../components/Message';
import {IsVietNamPhoneNumber} from '../utils/Logic';

const Register = () => {
  const From = () => {
    const HeaderForm = () => {
      const uNavigation = useNavigation();

      return (
        <View style={Styles.headerForm}>
          <Text style={Styles.question}>Your have an account, Do you want</Text>
          <SecondaryButton
            buttonStyle={Styles.loginButton}
            textStyle={Styles.loginText}
            text={'Login'}
            onPress={() => uNavigation.goBack()}
          />
          <Text style={Styles.question}>?</Text>
        </View>
      );
    };
    const BodyForm = () => {
      const [hidePassword, setHidePassword] = useState(true);
      const [disabledCheckbox, setDisabledCheckbox] = useState(true);
      const [message, setMessage] = useState('');
      const [firstname, setFirstname] = useState('');
      const [lastname, setLastname] = useState('');
      const [phone, setPhone] = useState('');
      const [password, setPassword] = useState('');
      const [rePassword, setRePassword] = useState('');

      const onChangeCheckbox = () => {
        setDisabledCheckbox(disabledCheckbox ? false : true);
      };
      const onChangeHidePassword = () => {
        setHidePassword(hidePassword ? false : true);
      };
      const onTabs = () => {
        if (firstname == '') {
          setMessage('firstname');
        } else if (lastname == '') {
          setMessage('lastname');
        } else if (phone == '') {
          setMessage('phone');
        } else if (!IsVietNamPhoneNumber(phone)) {
          setMessage('formatPhone');
        } else if (password == '') {
          setMessage('password');
        } else if (password != rePassword) {
          setMessage('repassword');
        }
      };

      return (
        <View>
          <BoxTextInput
            placeholder={'Your firstname'}
            width={294}
            value={firstname}
            onChangeText={newFirstname => setFirstname(newFirstname)}
          />
          <Message
            message={
              message == 'firstname' ? 'enter your firstname, please' : ''
            }
            icon={'frown-o'}
            height={message == 'firstname' ? 32 : 0}
          />
          <BoxTextInput
            placeholder={'Your lastname'}
            width={294}
            value={lastname}
            onChangeText={newLastname => setLastname(newLastname)}
          />
          <Message
            message={message == 'lastname' ? 'enter your lastname, please' : ''}
            icon={'frown-o'}
            height={message == 'lastname' ? 32 : 0}
          />
          <BoxTextInput
            placeholder={'Your phone'}
            width={294}
            value={phone}
            onChangeText={newPhone => setPhone(newPhone)}
          />
          <Message
            message={
              message == 'phone'
                ? 'enter your phone, please'
                : message == 'formatPhone'
                ? 'your phone is not vietname phone number'
                : ''
            }
            icon={'frown-o'}
            height={message == 'phone' || message == 'formatPhone' ? 32 : 0}
          />
          <Message
            message={message == 'phone' ? 'enter your phone, please' : ''}
            icon={'frown-o'}
            height={message == 'phone' ? 32 : 0}
          />
          <BoxTextInput
            placeholder={'Password'}
            width={270}
            secureTextEntry={hidePassword}
            right={
              <EyeButton
                icon={hidePassword ? 'eye-slash' : 'eye'}
                onChangeHidePassword={onChangeHidePassword}
              />
            }
            value={password}
            onChangeText={newPassword => setPassword(newPassword)}
          />
          <Message
            message={message == 'password' ? 'enter your password, please' : ''}
            icon={'frown-o'}
            height={message == 'password' ? 32 : 0}
          />
          <BoxTextInput
            placeholder={'Re-password'}
            width={270}
            secureTextEntry={hidePassword}
            right={
              <EyeButton
                icon={hidePassword ? 'eye-slash' : 'eye'}
                onChangeHidePassword={onChangeHidePassword}
              />
            }
            value={rePassword}
            onChangeText={newRePassword => setRePassword(newRePassword)}
          />
          <Message
            message={
              message == 'repassword' ? 'check your re-password, please' : ''
            }
            icon={'frown-o'}
            height={message == 'repassword' ? 32 : 0}
          />
          <View style={Styles.agree}>
            <Checkbox onPress={onChangeCheckbox} disabled={disabledCheckbox} />
            <Text style={{color: '#FFFFFF'}}>
              I agree to the terms and conditions.
            </Text>
          </View>
          <PrimaryButton
            value={'Register'}
            disabled={disabledCheckbox}
            onPress={onTabs}
          />
        </View>
      );
    };

    return (
      <View>
        <HeaderForm />
        <BodyForm />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={Styles.container}>
      <ScrollView>
        <Logo />
        <From />
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
  headerForm: {
    paddingLeft: 32,
    flexDirection: 'row',
    paddingBottom: 8,
  },
  question: {
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  loginButton: {
    marginHorizontal: 4,
  },
  loginText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  agree: {
    paddingLeft: 32,
    marginTop: 16,
    flexDirection: 'row',
  },
});

export default Register;
