import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Keyboard,
} from "react-native";
import { Actions } from "react-native-router-flux";
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      age: 0,
    };
  }

  saveData = async () => {
    const { userName, password } = this.state;

    //save data with asyncstorage
    let SignUpDetails = {
      userName: userName,
      password: password,
      age: age,
    };
  };

  showData = async () => {
    let SignUpDetails = await AsyncStorage.getItem("SignUpDetails");
    let ld = JSON.parse(SignUpDetails);
    //This is where the http request is impelemented
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.signInTitle}>Sign up</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(age) => this.setState({ age })}
          placeholder="Age"
          placeholderTextColor="#0a77aa"
          selectionColor="#0a77aa"
          onSubmitEditing={() => this.userName.focus()}
        />

        <TextInput
          style={styles.inputBox}
          onChangeText={(userName) => this.setState({ userName })}
          placeholder="User name"
          placeholderTextColor="#0a77aa"
          selectionColor="#0a77aa"
          keyboardType="userName-address"
          onSubmitEditing={() => this.password.focus()}
        />

        <TextInput
          style={styles.inputBox}
          onChangeText={(password) => this.setState({ password })}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#0a77aa"
          ref={(input) => (this.password = input)}
        />

        <TouchableOpacity style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={this.saveData}
            onPress={() =>
              this.props.navigation.navigate("Page 4", { name: "Page 4" })
            }
          >
            Sign Up
          </Text>
        </TouchableOpacity>
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
});
