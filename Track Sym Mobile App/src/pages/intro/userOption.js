import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  ApplicationProvider,
  IconRegistry,
  Spinner,
  Button,
  Layout,
} from "@ui-kitten/components";
import { Image, Dimensions } from "react-native";

export default class UserOption extends React.Component {
  _changeScreen = (userOption) => {
    if (userOption === "Sign up") {
      console.log("going to sign up");
      this.props.navigation.navigate("SignUpScreen");
    } else {
      this.props.navigation.navigate("LoginScreen");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Layout
          level="3"
          style={{
            backgroundColor: "white",
            width: 100,
            height: 100,
            borderRadius: 50,

            marginBottom: 30,
          }}
        >
          <Image
            source={require("../../../assets/images/app_icon.png")}
            style={{
              width: 100,
              height: 90,
            }}
          />
          <Text
            style={{
              fontWeight: "bold",
              color: "#4da6ff",
              fontSize: 17,
              paddingLeft: 10,
            }}
          >
            Track Sym
          </Text>
        </Layout>
        <Button
          appearance="ghost"
          status="basic"
          style={{
            backgroundColor: "#4da6ff",
            margin: 10,
            width: Dimensions.get("window").width - 10,
          }}
          onPress={() => this._changeScreen("Sign up")}
        >
          <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>
            Create Account
          </Text>
        </Button>
        <Button
          appearance="ghost"
          status="basic"
          style={{
            backgroundColor: "white",

            //   shadowColor: "#000",
            //   shadowOffset: {
            //     width: 0,
            //     height: 1,
            //   },
            //   shadowOpacity: 0.2,
            //   shadowRadius: 1.41,

            //   elevation: 2,
          }}
          onPress={() => this._changeScreen("Sign in")}
        >
          <Text style={{ fontWeight: "bold", color: "#4da6ff", fontSize: 17 }}>
            Sign in
          </Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
