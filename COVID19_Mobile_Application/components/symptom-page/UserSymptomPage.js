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
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);

export default class UserSymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSymptoms: [],
      loading: true,
      user_longitude: 0.0,
      user_latitude: 0.0,
    };
    symptomStore.subscribe(() => {
      this.fetchUserSymptoms(userIDStore.getState().userId);
    });
    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
  }

  onUserLocationUpdate(location) {
    this.setState({ user_latitude: location.coords.latitude });
    this.setState({ user_longitude: location.coords.longitude });
  }

  componentDidMount() {
    this.fetchUserSymptoms(userIDStore.getState().userId);
    this.fetchData();
    let interval = setInterval(() => {
      this.fetchData();
    }, 1000);

    this.timer = setInterval(() => {
      if (this.state.userSymptoms.length != 0) {
        fetch("https://sym-track.herokuapp.com/api/user_locations", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + userIDStore.getState().userToken,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            longitude: this.state.user_longitude,
            latitude: this.state.user_latitude,
            user_id: userIDStore.getState().userId,
            TTL: 10000,
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("No symptoms to report");
        console.log(
          this.state.user_latitude + " , " + this.state.user_longitude
        );
      }
    }, 10000);
  }

  fetchData() {
    this.setState({ userSymptoms: symptomStore.getState() });
  }

  //gets the list of symptoms from database
  fetchUserSymptoms(userId) {
    let newThis = this; // create variable for referencing 'this'
    fetch("https://sym-track.herokuapp.com/api/symptomuser/user/" + userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userIDStore.getState().userToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // fetching user symptoms from the database is successful and updating local state using redux
        symptomStore.dispatch(symptomActions.addSymptom(json));
        newThis.setState({
          loading: false,
        });
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
          subtitleStyle={styles.subtitle}
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
        <MapboxGL.UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
          onUpdate={this.onUserLocationUpdate}
        />
        {this.state.loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 80,
            }}
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
    borderRadius: 30,
    backgroundColor: "#1976d2",
    color: "#ffffff",
    flex: 1,
    fontFamily: "PlayfairDisplay",
  },
  subtitle: {
    borderColor: "#000000",
    marginBottom: 5,
    borderRadius: 30,
    backgroundColor: "#1976d2",
    color: "#ffffff",
    flex: 1,
    fontFamily: "PlayfairDisplay",
    fontSize: 14,
  },
  emptyCard: {
    marginTop: 80,
    borderRadius: 50,
  },
});
