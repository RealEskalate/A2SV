import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import userIDStore from "../data-management/user-id-data/userIDStore";
import symptomStore from "../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../data-management/user-symptom-data/symptomActions";
import { ListItem, Button, Card } from "react-native-elements";

export default class UserSymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSymptoms: [],
      loading: true,
    };
    symptomStore.subscribe(() => {
      this.fetchUserSymptoms(userIDStore.getState().userId);
    });
  }

  componentDidMount() {
    this.fetchData();
    let interval = setInterval(() => {
      this.fetchData();
    }, 1000);
  }

  fetchData() {
    this.setState({ userSymptoms: symptomStore.getState(), loading: false });
  }

  //gets the list of symptoms from database
  fetchUserSymptoms(userId) {
    let newThis = this; // create variable for referencing 'this'
    fetch("https://sym-track.herokuapp.com/api/symptomuser/user/" + userId, {
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

  //return the corresponding mapping for each item in corresponding UI componenets.
  contents = () =>
    this.state.userSymptoms.map((symptom) => {
      return (
        <ListItem
          key={symptom.Symptom._id}
          title={symptom.Symptom.name}
          subtitle={symptom.Symptom.description}
          style={styles.symptoms}
          containerStyle={styles.symptoms}
          titleStyle={styles.symptoms}
          subtitleStyle={styles.symptoms}
        />
      );
    });

  //If user hasn't registered any symptoms
  emptySymptomList = () => {
    return (
      <Card
        title="Thank God!"
        image={require("../../assets/images/avatar.png")}
        containerStyle={styles.emptyCard}
        titleStyle={{ fontSize: 30 }}
      >
        <Text style={{ marginBottom: 10, textAlign: "center", fontSize: 18 }}>
          You have no symptoms registered yet
        </Text>
      </Card>
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#1976d2" />
          </View>
        ) : this.state.userSymptoms.length == 0 ? (
          this.emptySymptomList()
        ) : (
          this.contents()
        )}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  symptoms: {
    borderColor: "#000000",
    marginBottom: 5,
    borderRadius: 50,
    backgroundColor: "#1976d2",
    color: "#ffffff",
  },
  emptyCard: {
    marginTop: 80,
    borderRadius: 50,
  },
});
