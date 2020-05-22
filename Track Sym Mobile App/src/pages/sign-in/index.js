import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {
  Button,
  Input,
  Layout,
  Text,
  useStyleSheet,
  Icon,
  Modal,
  Card,
  Spinner,
} from '@ui-kitten/components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import userIDStore from '../../../components/data-management/user-id-data/userIDStore';
import * as actions from '../../../components/data-management/user-id-data/userIDActions';
import themedStyles from './extra/themedStyles';

const PersonIcon = (style) => <Icon {...style} name="person" />;

export default ({navigation}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [usernameCap, setUsernameCap] = React.useState('');
  const [passwordCap, setPasswordCap] = React.useState('');
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState('basic');
  const [passwordStatus, setPasswordStatus] = React.useState('basic');
  const [modalState, setModalState] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = () => {
    navigation && navigation.navigate('SignUpScreen');
  };

  const onForgotPasswordButtonPress = () => {
    // navigation && navigation.navigate('ForgotPassword');
  };

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const LoadingIndicator = (props) => {
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size="small" />
      </View>
    );
  };

  const onUserNameChange = (name) => {
    if (name !== '') {
      setUsernameStatus('basic');
      setUsernameCap('');
    } else {
      setUsernameStatus('danger');
      setUsernameCap('Username cannot be empty !');
    }
    setUsername(name);
  };

  const onPasswordChange = (pass) => {
    if (pass !== '') {
      setPasswordStatus('basic');
      setPasswordCap('');
    } else {
      setPasswordStatus('danger');
      setPasswordCap('Password cannot be empty !');
    }
    setPassword(pass);
  };

  const onSubmitForm = () => {
    if (username === '') {
      setUsernameStatus('danger');
      setModalMessage('Username cannot be empty!');
      setModalState(true);
      return;
    }

    if (password === '') {
      setPasswordStatus('danger');
      setModalMessage('Password cannot be empty!');
      setModalState(true);
      return;
    }

    setIsLoading(true);
    login();
  };

  //Log in authentication
  const login = () => {
    fetch('https://sym-track.herokuapp.com/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        userIDStore.dispatch(
          actions.addUser(
            json.user._id,
            json.user.username,
            json.token,
            json.user.age_group,
            json.user.gender,
          ),
        );
        this.saveUser(
          json.user._id,
          json.user.username,
          json.token,
          json.user.age_group,
          json.user.gender,
        ); //storing the user id in async storage
        setIsLoading(false);
      })
      .catch((error) => {
        setModalMessage(
          'Invalid Credentials',
          'You have entered wrong user name or password, please try again!',
        );
        setModalState(true);
        setIsLoading(false);
      });
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Modal
        visible={modalState}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalState(false)}>
        <Card disabled={true}>
          <Text status="danger" category="h6" style={{marginBottom: 10}}>
            {modalMessage}
          </Text>
          <Button onPress={() => setModalState(false)}>DISMISS</Button>
        </Card>
      </Modal>

      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          WELCOME
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Sign in to your account
        </Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="Username"
          status={usernameStatus}
          accessoryRight={PersonIcon}
          value={username}
          caption={usernameCap}
          onChangeText={onUserNameChange}
        />
        <Input
          style={styles.passwordInput}
          status={passwordStatus}
          placeholder="Password"
          caption={passwordCap}
          accessoryRight={renderIcon}
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={onPasswordChange}
          onIconPress={onPasswordIconPress}
        />
        <View style={styles.forgotPasswordContainer}>
          <Button
            style={styles.forgotPasswordButton}
            appearance="ghost"
            status="basic"
            onPress={onForgotPasswordButtonPress}>
            Forgot your password?
          </Button>
        </View>
      </Layout>
      <Button
        style={styles.signInButton}
        size="giant"
        disabled={isLoading}
        accessoryLeft={() => (isLoading ? <LoadingIndicator /> : <></>)}
        onPress={() => onSubmitForm()}>
        SIGN IN
      </Button>
      <Button
        style={styles.signUpButton}
        appearance="ghost"
        status="basic"
        onPress={onSignUpButtonPress}>
        Don't have an account? Create
      </Button>
    </KeyboardAwareScrollView>
  );
};
