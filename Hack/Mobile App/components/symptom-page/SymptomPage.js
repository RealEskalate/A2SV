import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";

export default class SymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symptomId: "",
      symptoms: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
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
        console.log(this.state.symptoms);
      })
      .catch((error) => {
        console.log(error);
      });

    //
  }
  contents = () =>
    this.state.symptoms.map((item) => {
      //We need to return the corresponding mapping for each item too.
      return (
        item &&
        item._id &&
        item.name && (
          <Card key={item._id} style={styles.container}>
            <Text>{item.name}</Text>
          </Card>
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
