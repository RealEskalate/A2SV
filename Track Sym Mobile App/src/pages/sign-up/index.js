import React from 'react';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import {
  Button,
  CheckBox,
  Divider,
  Icon,
  Input,
  Text,
  useStyleSheet,
  Select,
  SelectItem,
  IndexPath,
  Modal,
  Card,
  Spinner,
  Layout,
} from '@ui-kitten/components';
import { ImageOverlay } from '../../components/ImageOverlay/image-overlay.component';
import { BackIcon, GoogleIcon, FacebookIcon, TwitterIcon } from './extra/icons';
import themedStyles from './extra/themedStyles.js';
import { KeyboardAvoidingView } from '../../components/3rd-party';

const data = [
  '0-10',
  '11-20',
  '21-30',
  '31-40',
  '41-50',
  '51-60',
  '61-70',
  '71-80',
  '81-90',
  '>90',
];

const genderData = ['MALE', 'FEMALE'];

export default ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [usernameCap, setUsernameCap] = React.useState('');
  const [passwordCap, setPasswordCap] = React.useState('');
  const [confirmPasswordCap, setConfirmPasswordCap] = React.useState('');
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState('basic');
  const [passwordStatus, setPasswordStatus] = React.useState('basic');
  const [modalMessage, setModalMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = React.useState(
    'basic'
  );
  const [modalState, setModalState] = React.useState(false);
  const [selectedAgeIndex, setSelectedAgeIndex] = React.useState(
    new IndexPath(0)
  );
  const [selectedGenderIndex, setSelectedGenderIndex] = React.useState(
    new IndexPath(0)
  );
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = () => {
    if (username === '') {
      setModalMessage('Please enter your username!');
      setModalState(true);
      setUsernameStatus('danger');
      return;
    }

    if (password === '') {
      setModalMessage('Please enter your password!');
      setModalState(true);
      setPasswordStatus('danger');
      return;
    }

    if (confirmPassword !== password) {
      setModalMessage("Password Don't match !");
      setModalState(true);
      setConfirmPasswordStatus('danger');
      return;
    }

    setIsLoading(true);
    signUpRequest();
  };

  const signUpRequest = async () => {
    const response = await fetch(
      'https://sym-track.herokuapp.com/api/auth/register',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          age_group: displayAgeValue,
          gender: displayGenderValue,
        }),
      }
    );

    if (response.status === 404) {
      setModalMessage('');
      setModalState(true);
      setIsLoading(false);
      return;
    }

    if (response.status === 500) {
      setModalMessage('Username already exists!');
      setModalState(true);
      setIsLoading(false);
      return;
    }

    if (response.status === 200) {
      navigation.goBack();
    }
  };

  const onSignInButtonPress = () => {
    navigation && navigation.navigate('LoginScreen');
  };

  const displayAgeValue = data[selectedAgeIndex.row];
  const renderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const displayGenderValue = genderData[selectedGenderIndex.row];
  const renderGenderOption = (title, index) => (
    <SelectItem title={title} key={index} />
  );

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onUserNameChange = (name) => {
    if (name !== '') {
      setUsernameStatus('basic');
      setUsernameCap('');
    } else {
      setUsernameStatus('danger');
      setUsernameCap('Username is required');
    }
    setUsername(name);
  };

  const onPasswordChange = (pass) => {
    if (pass !== '') {
      setPasswordStatus('basic');
      setPasswordCap('');
    } else {
      setPasswordStatus('danger');
      setPasswordCap('Password is required');
    }
    setPassword(pass);
  };

  const onConfirmPasswordChange = (pass) => {
    if (pass === password) {
      setConfirmPasswordStatus('basic');
      setConfirmPasswordCap('');
    } else {
      setConfirmPasswordStatus('danger');
      setConfirmPasswordCap("Password doesn't match");
    }
    setConfirmPassword(pass);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Modal
        visible={modalState}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalState(false)}>
        <Card disabled={true}>
          <Text status='danger' category='h6' style={{ marginBottom: 10 }}>
            {modalMessage}
          </Text>
          <Text
            style={{ alignSelf: 'flex-end', color: '#0080ff' }}
            onPress={() => setModalState(false)}>
            Dismiss
          </Text>
        </Card>
      </Modal>
      <ImageOverlay
        style={styles.headerContainer}
        source={require('../../../assets/images/signupBackground.png')}>
        <Button
          style={styles.evaButton}
          appearance='ghost'
          status='control'
          size='large'>
          TRACK SYM
        </Button>
        <View style={styles.signUpContainer}>
          <View style={styles.backContainer}>
            <Button
              style={styles.signInButton}
              appearance='ghost'
              status='control'
              size='giant'
              accessoryLeft={BackIcon}
              onPress={onSignInButtonPress}></Button>
          </View>
          <Text style={styles.signInLabel} category='h4' status='control'>
            SIGN UP
          </Text>
        </View>
      </ImageOverlay>
      <View style={[styles.container, styles.formContainer]}>
        <Input
          placeholder='Username'
          label='Username'
          caption={usernameCap}
          status={usernameStatus}
          autoCapitalize='words'
          value={username}
          onChangeText={(name) => onUserNameChange(name)}
        />
        <Select
          style={styles.select}
          label='Age Group'
          style={styles.formInput}
          placeholder='Default'
          value={displayAgeValue}
          selectedIndex={selectedAgeIndex}
          onSelect={(index) => setSelectedAgeIndex(index)}>
          {data.map((index, title) => renderOption(index, title))}
        </Select>
        <Select
          style={styles.select}
          label='Gender'
          style={styles.formInput}
          placeholder='Default'
          value={displayGenderValue}
          selectedIndex={selectedGenderIndex}
          onSelect={(index) => setSelectedGenderIndex(index)}>
          {genderData.map((index, title) => renderGenderOption(index, title))}
        </Select>
        <Input
          style={styles.formInput}
          label='Password'
          placeholder='Password'
          caption={passwordCap}
          status={passwordStatus}
          secureTextEntry={!passwordVisible}
          value={password}
          accessoryRight={renderIcon}
          onChangeText={(pass) => onPasswordChange(pass)}
        />
        <Input
          style={styles.formInput}
          caption={confirmPasswordCap}
          placeholder='Confirm Password'
          label='Confirm Password'
          status={confirmPasswordStatus}
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={(pass) => onConfirmPasswordChange(pass)}
        />
        <CheckBox
          style={styles.termsCheckBox}
          textStyle={styles.termsCheckBoxText}
          checked={termsAccepted}
          onChange={(checked) => setTermsAccepted(checked)}>
          <Text appearance='hint' category='c1'>
            {
              'By creating an account, I agree to the Track Sym Terms of\nUse and Privacy Policy'
            }
          </Text>
        </CheckBox>
      </View>
      <Button
        style={styles.signUpButton}
        size='large'
        disabled={isLoading}
        accessoryLeft={() => (isLoading ? <Spinner /> : <></>)}
        onPress={onSignUpButtonPress}>
        SIGN UP
      </Button>
      <Button style={styles.termsButton} appearance='ghost' status='basic'>
        Terms & Privacy
      </Button>
      {/* <View style={styles.orContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.orLabel} category='h5'>
          OR
        </Text>
        <Divider style={styles.divider} />
      </View>
      <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText}>
          Sign with a social account
        </Text>
        <View style={styles.socialAuthButtonsContainer}>
          <Button
            appearance='ghost'
            size='giant'
            status='primary'
            accessoryLeft={GoogleIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='primary'
            accessoryLeft={FacebookIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='primary'
            accessoryLeft={TwitterIcon}
          />
        </View> */}
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};
