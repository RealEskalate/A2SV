import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import userIDStore from "../data-management/user-id-data/userIDStore";
import symptomStore from "../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../data-management/user-symptom-data/symptomActions";

export default class SymptomPage extends Component {
  constructor({ route, navigation }) {
    super({ route, navigation });
    this.state = {
      symptomId: "",
      symptoms: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  //registers symptom on database and also stores in local data store
  sendDataAndRegisterSymptom(userId, symptomId, symptomName) {
    let listSymptoms = symptomStore.getState();
    if (listSymptoms.includes(symptomName)) {
      symptomStore.dispatch(symptomActions.removeSymptom(symptomName)); // removing symptom from local data store
      //console.log(symptomStore.getState());
    } else {
      this.sendData(userId, symptomId); // sending data to database
      symptomStore.dispatch(symptomActions.addSymptom(symptomName)); //addin symptom to local data store
      //console.log(symptomStore.getState());
    }
  }
  //gets the list of symptoms from database
  fetchData() {
    let newThis = this; // create variable for referencing 'this'
    fetch("http://34.70.173.73:3000/api/symptoms", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // fetching symptoms from the database is successful and storing in to our state
        newThis.setState(() => ({
          symptoms: json,
        }));
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
        alert("Success!"); // symptom registeration is successful
      })
      .catch((error) => {
        Alert.alert("Oops :(", "Couldn't resgister, please try again!");
      });
  }
  contents = () =>
    this.state.symptoms.map((item) => {
      //return the corresponding mapping for each item in corresponding UI componenets.
      return (
        item &&
        item._id &&
        item.name && (
          <TouchableOpacity
            onPress={
              () =>
                this.sendDataAndRegisterSymptom(
                  userIDStore.getState().userId,
                  item._id,
                  item.name
                ) // handling event when that specific symptom is clicked
            }
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
