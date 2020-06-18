import React, { Component } from "react";
import { StyleSheet, Image, SafeAreaView } from "react-native";
import userIDStore from "../../data-management/user-id-data/userIDStore";
import symptomStore from "../../data-management/user-symptom-data/symptomStore";
import languageStore from "../../data-management/language_data/languageStore";
import * as symptomActions from "../../data-management/user-symptom-data/symptomActions";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {
  Layout,
  Text,
  Spinner,
  List,
  ListItem,
  Divider,
} from "@ui-kitten/components";
import { ThemeContext } from "../../../assets/themes/theme-context";
import { strings } from "../../localization/localization";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);

export default class UserSymptomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSymptoms: null,
      loading: true,
      user_longitude: 0.0,
      user_latitude: 0.0,
      currLanguage: "English",
      currLangCode: languageStore.getState(),
    };
    symptomStore.subscribe(() => {
      this.fetchUserSymptoms(userIDStore.getState().userId);
      this.fetchData();
    });
    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.setState({ currLangCode: languageStore.getState() });
      this.componentDidMount();
    });

    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
  }

  static contextType = ThemeContext;

  onUserLocationUpdate(location) {
    this.setState({ user_latitude: location.coords.latitude });
    this.setState({ user_longitude: location.coords.longitude });
  }

  componentDidMount = async () => {
    await this.setState({ currLangCode: languageStore.getState() });
    switch (this.state.currLangCode) {
      case "am":
        await this.setState({ currLanguage: "Amharic" });
        break;
      case "en":
        await this.setState({ currLanguage: "English" });
        break;
      case "orm":
        await this.setState({ currLanguage: "Oromo" });
        break;
      case "tr":
        await this.setState({ currLanguage: "English" });
        break;
    }
    this.fetchUserSymptoms(userIDStore.getState().userId);
    this.fetchData();

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
          .then(() => {
            //console.log(json);
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
  };

  fetchData() {
    this.setState({ userSymptoms: symptomStore.getState() });
  }

  //gets the list of symptoms from database
  fetchUserSymptoms(userId) {
    let newThis = this; // create variable for referencing 'this'
    fetch(
      "https://sym-track.herokuapp.com/api/symptomuser/user/" +
        userId +
        "?language=" +
        this.state.currLanguage,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + userIDStore.getState().userToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        // fetching user symptoms from the database is successful and updating local state using redux
        symptomStore.dispatch(symptomActions.updateSymptomList(json));
        newThis.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //return the corresponding mapping for each item in corresponding UI componenets.
  contents = () => (
    <List
      data={this.state.userSymptoms}
      renderItem={({ item }) => (
        <>
          <ListItem
            style={{ padding: 5 }}
            title={item.Symptom.name}
            description={item.Symptom.description}
          />
          <Divider />
        </>
      )}
    />
  );

  //If user hasn't registered any symptoms
  emptySymptomList = () => {
    return (
      <Layout
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {/* <MaterialCommunityIcons
          name="grease-pencil"
          size={60}
          color={customTheme.theme === "light" ? "black" : "white"}
        /> */}
        <Image
          style={{ width: 200, height: 250 }}
          resizeMode="contain"
          source={require("../../../assets/images/empty.png")}
        />
        <Text>{strings.YouHaveNotRegisteredAnySymptom}</Text>
      </Layout>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={{ flex: 1 }}>
          {this.state.loading ? (
            <Layout
              level="2"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner />
            </Layout>
          ) : (
            <Layout style={{ flex: 1 }}>
              <MapboxGL.UserLocation
                visible={true}
                showsUserHeadingIndicator={true}
                onUpdate={this.onUserLocationUpdate}
              />
              {this.state.userSymptoms != null &&
              this.state.userSymptoms.length === 0
                ? this.emptySymptomList()
                : this.contents()}
            </Layout>
          )}
        </Layout>
      </SafeAreaView>
    );
  }
}
