import React, { Component } from "react";
import {
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Picker,
  Alert,
} from "react-native";
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      age: "",
      gender: "",
      invalidName: false,
      invalidPassword: false,
      userNameWarning: "Username should be between 3 - 50 characters",
      passwordWarning: "Password should be morethan 5 characters",
    };
  }

  //Log in authentication
  signUp = () => {
    if (
      !this.state.invalidName &&
      !this.state.invalidPassword &&
      this.state.userName.length > 3 &&
      this.state.password.length >= 6 &&
      this.state.gender !== "Select your gender" &&
      this.state.gender.length !== 0 &&
      this.state.age !== "Select your age group" &&
      this.state.age.length !== 0
    ) {
      fetch("http://34.70.173.73:3000/api/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.userName,
          password: this.state.password,
          age_group: this.state.age,
          gender: this.gender,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          this.props.navigation.navigate("Page 4", { name: "Page 4" });
        })
        .catch((error) => {
          Alert.alert(
            "Poor connection",
            "Couldn't resgister, please try again!"
          );
        });
    } else if (
      this.state.gender === "Select your gender" ||
      this.state.gender.length === 0 ||
      this.state.age === "Select your age group" ||
      this.state.age.length === 0 ||
      this.state.userName.length === 0 ||
      this.state.password.length === 0
    ) {
      Alert.alert(
        "Incomplete information",
        "Your registeration is incomplete, please enter all the necessary data!"
      );
    } else {
      Alert.alert(
        "Invalid Credentials",
        "You have entered an invalid user name or password. Please try again!"
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
        <Text style={styles.signInTitle}>Sign up</Text>
        <Picker
          placeholder="Select your gender"
          selectedValue={this.state.gender}
          style={{ height: 50, width: 300, color: "#0a77aa" }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({
              gender: itemValue,
            })
          }
        >
          <Picker.Item label="Select your gender" value="" />
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="Female" />
        </Picker>

        <Picker
          selectedValue={this.state.age}
          style={{ height: 50, width: 300, color: "#0a77aa" }}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({
              age: itemValue,
            })
          }
        >
          <Picker.Item label="Select your age range" value="" />
          <Picker.Item label="Under 30" value="UNDER_30" />
          <Picker.Item label="31 to 45" value="31_To_45" />
          <Picker.Item label="Above 45" value="ABOVE_45" />
        </Picker>

        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => this.validateUserName(text)}
          placeholder="User name"
          placeholderTextColor="#0a77aa"
          selectionColor="#0a77aa"
          keyboardType="userName-address"
        />
        <Text style={styles.warning}>
          {this.state.invalidName ? this.state.userNameWarning : ""}
        </Text>

        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => this.validatePassword(text)}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#0a77aa"
          ref={(input) => (this.password = input)}
          // onSubmitEditing={this.validatePassword(this.state.password)}
        />
        <Text style={styles.warning}>
          {this.state.invalidPassword ? this.state.passwordWarning : ""}
        </Text>

        <TouchableOpacity style={styles.button} onPress={this.signUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
//style of each components on this page
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
    color: "#f21509",
    fontSize: 12,
  },
});
