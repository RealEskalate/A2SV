import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";

export default class SymptomPage extends Component {
  constructor({ route, navigation }) {
    super({ route, navigation });
    this.state = {
      //userId: route.params.userId,
      symptomId: "",
      symptoms: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  //gets the list of symptoms from database
  fetchData() {
    let newThis = this; // create variable for referencing this
    fetch("http://34.70.173.73:3000/api/symptoms", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // change this
        newThis.setState(() => ({
          symptoms: json,
        }));
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Registers symptom with the user id
  sendData(userId, symptomId) {
    fetch("http://34.70.173.73:3000/api/symptomuser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptom_id: symptomId,
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        alert("Success!");
      })
      .catch((error) => {
        Alert.alert("Oops :(", "Couldn't resgister, please try again!");
      });
  }
  contents = () =>
    this.state.symptoms.map((item) => {
      // return the corresponding mapping for each item
      return (
        item &&
        item._id &&
        item.name && (
          <TouchableOpacity
          //onPress={() => this.sendData(this.state.userId, item._id)}
          >
            <Card key={item._id} style={styles.container}>
              <Text>{item.name}</Text>
            </Card>
          </TouchableOpacity>
        )
      );
    });

  render() {
    return <ScrollView>{this.contents()}</ScrollView>;
  }
}
const styles = StyleSheet.create({
  container: {
    borderColor: "#000000",
    padding: 30,
    margin: 5,
    borderRadius: 15,
    flexDirection: "row",
  },
});
