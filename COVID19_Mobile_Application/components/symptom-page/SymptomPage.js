import React, { Component } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import userIDStore from "../data-management/user-id-data/userIDStore";
import symptomStore from "../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../data-management/user-symptom-data/symptomActions";
import { CheckBox, Icon } from "react-native-elements";

export default class SymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symptomId: "",
      symptoms: [],
      userSymptoms: [],
    };
  }

  componentDidMount() {
    this.fetchSymptoms();
    this.fetchUserSymptoms(userIDStore.getState().userId);
    let interval = setInterval(() => {
      this.fetchData();
    }, 1000);
  }
  fetchData() {
    this.setState({ userSymptoms: symptomStore.getState() });
  }

  //registers symptom on database and also stores in local data store
  handleSymptomAction(userId, symptomId) {
    let listSymptoms = symptomStore.getState();

    let symptom = listSymptoms.find((obj) => obj.symptom_id == symptomId);

    if (symptom != null) {
      this.removeSymptom(userId, symptom._id, symptomId);
    } else {
      this.registerSymptom(userId, symptomId);
    }
  }

  //gets the list of symptoms from database
  fetchSymptoms() {
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
        //console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
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
  //Registers symptom with the user id
  registerSymptom(userId, symptomId) {
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
        // symptom registeration is successful
        this.fetchUserSymptoms(userIDStore.getState().userId); // get the update from database and update local state
        //console.log(symptomStore.getState());
      })

      .catch((error) => {
        Alert.alert("Oops :(", "Couldn't resgister, please try again!");
      });
  }

  //removes symptom with the user id
  removeSymptom(userId, randomId, symptomId) {
    fetch("http://34.70.173.73:3000/api/symptomuser", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: randomId,
        symptom_id: symptomId,
        user_id: userId,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // symptom removal is successful
        this.fetchUserSymptoms(userIDStore.getState().userId); // get the update from database and update local state
        //console.log(json);
      })
      .catch((error) => {
        Alert.alert("Oops :(", "Couldn't remove, please try again!");
      });
  }

  //check if a symptom has already been registered by user
  doesSymptomAlreadyRegistered(symptomId) {
    let symptom = this.state.userSymptoms.find(
      (obj) => obj.symptom_id == symptomId
    );

    if (symptom != null) {
      return true;
    }
    return false;
  }

  contents = () =>
    this.state.symptoms.map((item) => {
      //return the corresponding mapping for each item in corresponding UI componenets.
      return (
        item &&
        item._id &&
        item.name && (
          <CheckBox
            title={item.name}
            checked={this.doesSymptomAlreadyRegistered(item._id)}
            onPress={() =>
              this.handleSymptomAction(userIDStore.getState().userId, item._id)
            }
          />
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
