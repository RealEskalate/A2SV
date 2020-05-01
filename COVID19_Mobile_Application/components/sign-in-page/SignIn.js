import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import userIDStore from '../data-management/user-id-data/userIDStore';
import * as actions from '../data-management/user-id-data/userIDActions';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      invalidName: false,
      invalidPassword: false,
      userNameWarning: 'Enter your user name',
      passwordWarning: 'Enter your password',
      logInButtonPressed: false,
      passwordVisibility: false,
      check_textInputChange: false,
    };
  }

  saveUser = async (userID, userName) => {
    await AsyncStorage.setItem('userID', userID); //save user id on async storage
    await AsyncStorage.setItem('userName', userName); //save user name on async storage
  };

  //Log in authentication
  login = () => {
    this.setState({ buttonPressed: true });
    if (this.state.userName.length > 0 && this.state.password.length > 0) {
      fetch('https://sym-track.herokuapp.com/api/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          userIDStore.dispatch(
            actions.addUser(json.user._id, json.user.username)
          );
          this.saveUser(json.user._id, json.user.username); //storing the user id in async storage
        })
        .catch((error) => {
          Alert.alert(
            'Invalid Credentials',
            'You have entered wrong user name or password, please try again!'
          );
          this.setState({ buttonPressed: false }); //re enable log in button
        });
    } else {
      Alert.alert(
        'Incomplete information',
        'Please enter both your username and password!'
      );
      this.setState({ buttonPressed: false }); //re enable log in button
    }
  };

  //Input validation
  validateUserName(name) {
    this.setState({
      userName: name,
    });
    if (name.length === 0) {
      this.state.invalidName = false;
    } else {
      this.state.invalidName = true;
    }
  }
  validatePassword(pass) {
    this.setState({
      password: pass,
    });
    if (pass.length === 0) {
      this.state.invalidPassword = false;
      return true;
    } else {
      this.state.invalidPassword = true;
      return false;
    }
  }
  onTogglePasswordVisiblity() {
    this.setState((prevState) => ({
      ...prevState,
      passwordVisibility: !prevState.passwordVisibility,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMethod='resize'
          source={require('../../assets/signinBackground.png')}
          style={styles.header}>
          <Text style={styles.text_header}>Welcome</Text>
        </ImageBackground>

        <Animatable.View animation='fadeInUpBig' style={styles.footer}>
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name='user-o' color='#05375a' size={20} />
            <TextInput
              placeholder='Your username'
              onChangeText={(userName) =>
                this.setState({ userName, check_textInputChange: true })
              }
              style={styles.textInput}
              onSubmitEditing={() => this.password.focus()}
            />
            {this.state.check_textInputChange ? (
              <Animatable.View animation='bounceIn'>
                <Feather name='check-circle' color='green' size={20} />
              </Animatable.View>
            ) : null}
          </View>

          <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
          <View style={styles.action}>
            <FontAwesome name='lock' color='#05375a' size={20} />
            <TextInput
              placeholder='Your password'
              onChangeText={(password) => this.setState({ password })}
              secureTextEntry={!this.state.passwordVisibility}
              style={styles.textInput}
              ref={(input) => (this.password = input)}
            />

            <TouchableOpacity
              style={{ width: 30, height: 30 }}
              onPress={() => this.onTogglePasswordVisiblity()}>
              {this.state.passwordVisibility ? (
                <Feather name='eye-off' color='grey' size={20} />
              ) : (
                <Feather name='eye' color='grey' size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.button]}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={this.login}
              disabled={this.state.buttonPressed}>
              <Text style={([styles.textSign], { color: 'white' })}>LOGIN</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sbutton]}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={([styles.textSign], { color: '#1565c0' })}>
                SIGN UP
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.buttonPressed ? (
            <ActivityIndicator
              size='large'
              color='#1565c0'
              style={{ marginTop: 10 }}
            />
          ) : null}
        </Animatable.View>
      </View>
    );
  }
}
//style of each components on this page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1565c0',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1565c0',
    borderRadius: 50,
    marginTop: 50,
  },
  sbutton: {
    alignItems: 'center',
    borderColor: '#1565c0',
    borderWidth: 1,
    borderRadius: 50,
    marginTop: 20,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUp: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
