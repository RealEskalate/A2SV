import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from "react-native";
import { Actions } from "react-native-router-flux";
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      invalidName: false,
      invalidPassword: false,
      userNameWarning: "Enter your user name",
      passwordWarning: "Enter your password",
    };
  }
  isLoggedin() {
    this.loadInitialState().done();
  }
  loadInitialState = async () => {
    let user = await AsyncStorage.getItem("user");
    if (user !== null) {
      this.props.navigation.navigate("Page 6", { name: "Page 6" });
    } else {
    }
  };

  //Log in authentication
  login = () => {
    if (this.state.userName.length > 0 && this.state.password.length > 0) {
      fetch("http://34.70.173.73:3000/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          this.props.navigation.navigate("Page 6", { name: "Page 6" });
        })
        .catch((error) => {
          Alert.alert(
            "Invalid Credentials",
            "You have entered wrong user name or password, please try again!"
          );
        });
    } else {
      Alert.alert(
        "Incomplete information",
        "Please enter both your username and password!"
      );
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.signInTitle}>Sign in</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(userName) => this.setState({ userName })}
          placeholder="User name"
          placeholderTextColor="#0a77aa"
          selectionColor="#0a77aa"
          keyboardType="userName-address"
          onSubmitEditing={() => this.password.focus()}
        />
        <Text style={styles.warning}>{this.state.userNameWarning}</Text>

        <TextInput
          style={styles.inputBox}
          onChangeText={(password) => this.setState({ password })}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#0a77aa"
          ref={(input) => (this.password = input)}
        />
        <Text style={styles.warning}>{this.state.passwordWarning}</Text>
        <TouchableOpacity style={styles.button} onPress={this.login}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Doesn't have an account? </Text>
          <TouchableOpacity>
            <Text
              style={styles.signupButton}
              onPress={() =>
                this.props.navigation.navigate("Page 5", {
                  name: "Page 5",
                })
              }
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    width: 300,
    backgroundColor: "#eeeeee",
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0a77aa",
    marginVertical: 10,
    padding: 10,
  },
  button: {
    width: 300,
    backgroundColor: "#0a77aa",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
  },
  signInTitle: {
    fontSize: 30,
    color: "#0a77aa",
  },
  signupTextCont: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 16,
    flexDirection: "row",
  },
  signupText: {
    fontSize: 16,
  },
  signupButton: {
    color: "#12799f",
    fontSize: 16,
    fontWeight: "500",
  },
  warning: {
    width: 270,
    color: "#01b723",
    fontSize: 12,
  },
});
