import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import userIDStore from "../data-management/user-id-data/userIDStore";
import symptomStore from "../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../data-management/user-symptom-data/symptomActions";
import { ListItem, Button } from "react-native-elements";

export default class UserSymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSymptoms: [],
    };
    symptomStore.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentDidMount() {
    this.fetchData();
    this.fetchUserSymptoms(userIDStore.getState().userId);
    let interval = setInterval(() => {
      this.fetchData();
    }, 1000);
  }

  //gets the list of symptoms from database
  fetchData() {
    this.setState({ userSymptoms: symptomStore.getState() });
  }

  //gets the list of symptoms from database
  fetchUserSymptoms(userId) {
    let newThis = this; // create variable for referencing 'this'
    fetch("http://34.70.173.73:3000/api/symptomuser/user/" + userId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // fetching user symptoms from the database is successful and updating local state using redux
        symptomStore.dispatch(symptomActions.addSymptom(json));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  contents = () =>
    this.state.userSymptoms.map((symptom) => {
      //return the corresponding mapping for each item in corresponding UI componenets.
      return (
        <ListItem
          //key={i}
          title={symptom.Symptom.name}
          subtitle={symptom.Symptom.description}
          bottomDivider
          style={{ marginBottom: 5 }}
        />
      );
    });

  render() {
    return (
      <ScrollView>
        {this.contents()}
        <Button
          title="Manage your symptoms"
          type="outline"
          onPress={() =>
            this.props.navigation.navigate("Symptoms", {
              name: "Page 7",
            })
          }
        />
      </ScrollView>
    );
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
