import React, { Component } from "react";
import { View, Text } from "react-native";

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
          <View key={item._id}>
            <Text>{item.name}</Text>
          </View>
        )
      );
    });

  render() {
    return <View>{this.contents()}</View>;
  }
}
