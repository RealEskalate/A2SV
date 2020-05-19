import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Picker,
  Alert,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      age: '',
      gender: '',
      invalidName: false,
      invalidPassword: false,
      userNameWarning: 'Username should be between 3 - 50 characters',
      passwordWarning: 'Password should be more than 5 characters',
      check_textInputChange: false,
      passwordVisibility: true,
    };
  }
  onUsernameTextChange = (val) => {
    if (val.length !== 0) {
      this.setState((previousState) => ({
        ...previousState,
        username: val,
        check_textInputChange: true,
      }));
    } else {
      this.setState((previousState) => ({
        ...previousState,
        check_textInputChange: false,
      }));
    }
  };

  onPasswordTextChange = (val) => {
    if (val.length !== 0) {
      this.setState((previousState) => ({
        ...previousState,
        password: val,
      }));
    }
  };
  onTogglePasswordVisiblity = () => {
    this.setState((previousState) => ({
      ...previousState,
      passwordVisibility: !previousState.passwordVisibility,
    }));
  };

  //Log in authentication
  signUp = () => {
    console.log(this.state.gender);
    if (
      !this.state.invalidName &&
      !this.state.invalidPassword &&
      this.state.userName.length > 3 &&
      this.state.password.length >= 6 &&
      this.state.gender !== 'Select your gender' &&
      this.state.gender.length !== 0 &&
      this.state.age !== 'Select your age group' &&
      this.state.age.length !== 0
    ) {
      fetch('https://sym-track.herokuapp.com/api/auth/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.password,
          age_group: this.state.age,
          gender: this.state.gender,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          this.props.navigation.navigate('SignIn');
        })
        .catch((error) => {
          Alert.alert(
            'Poor connection',
            "Couldn't resgister, please try again!",
          );
        });
    } else if (
      this.state.gender === 'Select your gender' ||
      this.state.gender.length === 0 ||
      this.state.age === 'Select your age group' ||
      this.state.age.length === 0 ||
      this.state.userName.length === 0 ||
      this.state.password.length === 0
    ) {
      Alert.alert(
        'Incomplete information',
        'Your registeration is incomplete, please enter all the necessary data!',
      );
    } else {
      Alert.alert(
        'Invalid Credentials',
        'You have entered an invalid user name or password. Please try again!',
      );
    }
  };
  //Input validation
  validateUserName(name) {
    this.setState({
      userName: name,
    });
    if (name.length > 3 && name.length < 50) {
      this.state.invalidName = false;
    } else {
      this.state.invalidName = true;
    }
  }
  validatePassword(pass) {
    this.setState({
      password: pass,
    });
    if (pass.length >= 6) {
      this.state.invalidPassword = false;
      return true;
    } else {
      this.state.invalidPassword = true;
      return false;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/signupBackground.png')}
          style={styles.header}>
          <Text style={styles.text_header}>Register Now!</Text>
        </ImageBackground>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <ScrollView>
            <Text style={styles.text_footer}>Gender</Text>
            <View style={styles.action}>
              <MaterialCommunityIcons
                name="human-male-female"
                size={20}
                color="#05375a"
              />
              <Picker
                placeholder="Select your gender"
                selectedValue={this.state.gender}
                style={styles.textInput}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    gender: itemValue,
                  })
                }>
                <Picker.Item
                  label="Select your gender"
                  value="Select your gender"
                />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
              </Picker>
            </View>

            <Text style={styles.text_footer}>Age group</Text>
            <View style={styles.action}>
              <FontAwesome name="sort-numeric-asc" size={20} color="#05375a" />
              <Picker
                selectedValue={this.state.age}
                style={styles.textInput}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    age: itemValue,
                  })
                }>
                <Picker.Item
                  label="Select your age group"
                  value="Select your age group"
                />
                <Picker.Item label="0 - 10" value="0-10" />
                <Picker.Item label="11 - 20" value="11-20" />
                <Picker.Item label="21 - 30" value="21-30" />
                <Picker.Item label="31 - 40" value="31-40" />
                <Picker.Item label="41 - 50" value="41-50" />
                <Picker.Item label="51 - 60" value="51-60" />
                <Picker.Item label="61 - 70" value="61-70" />
                <Picker.Item label="71 - 80" value="71-80" />
                <Picker.Item label="81 - 90" value="81-90" />
                <Picker.Item label="Greater than 90" value=">90" />
              </Picker>
            </View>

            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                placeholder="Your username"
                onChangeText={(val) => this.validateUserName(val)}
                style={styles.textInput}
              />
              {this.state.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            <Text style={styles.warning}>
              {this.state.invalidName ? this.state.userNameWarning : ''}
            </Text>

            <Text style={styles.text_footer}>Password</Text>
            <View style={styles.action}>
              <FontAwesome name="lock" color="#05375a" size={20} />
              <TextInput
                placeholder="Your password"
                onChangeText={(text) => this.validatePassword(text)}
                secureTextEntry={this.state.passwordVisibility}
                style={styles.textInput}
                ref={(input) => (this.password = input)}
              />
              <TouchableOpacity
                style={{width: 30, height: 30}}
                onPress={() => this.onTogglePasswordVisiblity()}>
                {this.state.passwordVisibility ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.warning}>
              {this.state.invalidPassword ? this.state.passwordWarning : ''}
            </Text>

            {/* <Text style={[styles.text_footer, { marginTop: 20 }]}>
            Confirm Password
          </Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Confirm your password"
              secureTextEntry={this.state.passwordVisibility}
              onChangeText={(val) => onUsernameTextChange(val)}
              style={styles.textInput}
            />
            {this.state.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View> */}

            <View style={styles.button}>
              <TouchableOpacity style={styles.signIn} onPress={this.signUp}>
                <Text style={styles.textSign}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  picker: {
    color: '#05375a',
    fontSize: 18,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 3,
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'PlayfairDisplay',
  },
  action: {
    flexDirection: 'row',
    marginTop: 5,
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
    marginTop: 10,
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
    fontSize: 15,
    fontFamily: 'PlayfairDisplay',
    color: 'white',
  },
  warning: {
    color: '#f21509',
    fontSize: 12,
  },
});
