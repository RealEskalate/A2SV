import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import userIDStore from "../data-management/user-id-data/userIDStore";
import symptomStore from "../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../data-management/user-symptom-data/symptomActions";
import { ListItem, Button } from "react-native-elements";
import SymptomPage from "./SymptomPage";

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
  }

  //gets the list of symptoms from database
  fetchData() {
    this.setState({ userSymptoms: symptomStore.getState() });
  }

  contents = () =>
    this.state.userSymptoms.map((symptom) => {
      //return the corresponding mapping for each item in corresponding UI componenets.
      return (
        <ListItem
          //key={i}
          title={symptom.name}
          subtitle={symptom.description}
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
            this.props.navigation.navigate("Page 7", {
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
