import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";

import { ListItem, Header, SearchBar } from "react-native-elements";

export default class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedCountry: "",
      newsList: [],
      isLoading: true,
      searching: false,
      navgationId: 0,
    };
  }

  componentDidMount() {
    this.fetchNews();
  }

  onCountryChange = async (country) => {
    const result = await this.setState({
      searchedCountry: country,
      searching: true,
    });
    this.fetchNews();
    //stop showing the searching progresss
    if (this.state.searchedCountry === "") {
      const result = this.setState({
        searching: false,
      });
    }
  };

  //populate the ui with the news fetched from the api
  populateNews = () =>
    this.state.newsList.data.map((news) => {
      //return the corresponding mapping for each item in corresponding UI componenets.
      return (
        <ListItem
          key={news._id}
          title={news.title}
          subtitle={
            <Text
              style={{ color: "#1976d2" }}
              onPress={() => Linking.openURL(news.reference_link)}
            >
              Read more
            </Text>
          }
          bottomDivider
          style={{ marginBottom: 5 }}
        ></ListItem>
      );
    });

  //fetches news rom the api
  fetchNews() {
    if (this.state.searchedCountry !== "") {
      console.log(this.state.searchedCountry);
      fetch(
        "https://sym-track.herokuapp.com/api/news?country=" +
          this.state.searchedCountry,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            newsList: json,
            isLoading: false,
          });
          //console.log(json);
        })
        .catch((error) => {
          Alert.alert(
            "Couldn't connect",
            "Unable to connect to server, please try again!"
          );
        });
    } else {
      fetch("https://sym-track.herokuapp.com/api/news", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            newsList: json,
            isLoading: false,
          });
        })
        .catch((error) => {
          Alert.alert(
            "Couldn't connect",
            "Unable to connect to server, please try again!"
          );
        });
    }
  }
  render() {
    return (
      <ScrollView style={{ paddingTop: 25 }}>
        <SearchBar
          placeholder="Search country..."
          onChangeText={(searchedCountry) => {
            this.onCountryChange(searchedCountry);
          }}
          value={this.state.searchedCountry}
          showLoading={this.state.searching}
        />
        {this.state.isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 200,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          this.populateNews()
        )}
      </ScrollView>
    );
  }
}
