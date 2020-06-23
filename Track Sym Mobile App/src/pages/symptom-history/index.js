import React, { Component } from "react";
import {
  Layout,
  Text,
  List,
  Divider,
  Icon,
  Spinner,
  ListItem,
} from "@ui-kitten/components";
import { View, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import userIDStore from "../../data-management/user-id-data/userIDStore";
import symptomStore from "../../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../../data-management/user-symptom-data/symptomActions";
import languageStore from "../../data-management/language_data/languageStore";
import { strings } from "../../localization/localization";
import { LangContext } from "../../../assets/lang/language-context";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { ThemeContext } from "../../../assets/themes/theme-context";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);

const days = [
  strings.Sun,
  strings.Mon,
  strings.Tue,
  strings.Wed,
  strings.Thu,
  strings.Fri,
  strings.Sat,
];
const months = [
  strings.Jan,
  strings.Feb,
  strings.Mar,
  strings.Apr,
  strings.May,
  strings.Jun,
  strings.Jul,
  strings.Aug,
  strings.Sep,
  strings.Oct,
  strings.Nov,
  strings.Dec,
];

export default class SymptomHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      selectedIndex: -1,
      filteredData: [],
      currLanguage: "English",
      user_longitude: 0.0,
      user_latitude: 0.0,
      currLangCode: languageStore.getState(),
      currUserSymptoms: [],
      currSelected: true,
      calendar: [],
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

  //static contextType = ThemeContext;

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
    this.populateCalander();
    this.fetchSymptom();

    this.timer = setInterval(() => {
      if (this.state.currUserSymptoms.length != 0) {
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

  populateCalander = () => {
    caladerData = [];

    for (let index = 0; index < 14; index++) {
      currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - index);

      caladerData.push({
        day: currentDate.getDate(),
        dayIdx: currentDate.getDay(),
        monthIdx: currentDate.getMonth(),
        compareDate: new Date(currentDate),
      });
    }

    this.setState({ calendar: caladerData });
  };

  compareDate = (date1, date2) => {
    return (
      date1.getDate() <= date2.getDate() &&
      date1.getMonth() <= date2.getMonth() &&
      date1.getFullYear() <= date2.getFullYear()
    );
  };

  colors = {
    LOW: "#558b2f",
    MEDIUM: "#fbc02d",
    HIGH: "#d32f2f",
  };

  fetchData() {
    this.setState({ currUserSymptoms: symptomStore.getState() });
  }

  fetchSymptom = async () => {
    let newThis = this; // create variable for referencing 'this'
    fetch(
      `https://sym-track.herokuapp.com/api/symptomuserhistory/user/${
        userIDStore.getState().userId
      }`,
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
        newThis.setState({
          data: json.events,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getParsedDate = (unparsedDate) => {
    date = new Date(unparsedDate);
    return `${
      months[date.getMonth()]
    } ${date.getDate()} - ${date.getFullYear()}`;
  };

  updateSymptomHistory = (dateIndex) => {
    this.setState({
      loading: true,
      currSelected: false,
      selectedIndex: dateIndex,
    });

    let selectedDate = new Date();
    if (this.state.calendar) {
      selectedDate = new Date(this.state.calendar[dateIndex].compareDate);
    }

    this.setState({
      filteredData: this.state.data.filter((d) => {
        return (
          this.compareDate(selectedDate, new Date(d.start)) &&
          this.compareDate(new Date(d.end), selectedDate)
        );
      }),
    });

    this.setState({
      loading: false,
    });
  };
  //If user hasn't registered any symptom
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
  //gets the list of symptoms from database
  fetchUserSymptoms = (userId) => {
    //console.log(currLanguage);
    this.setState({
      loading: true,
    });
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
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  contents = () => (
    <List
      data={this.state.currUserSymptoms}
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
  render() {
    return (
      <Layout style={styles.contanier} level="2">
        <Layout style={{ flex: 1 }}>
          <Layout style={{ flexDirection: "row" }}>
            <List
              horizontal
              data={this.state.calendar}
              inverted
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    this.updateSymptomHistory(index);
                  }}
                >
                  <Layout
                    level={this.state.selectedIndex === index ? "3" : "1"}
                    style={{
                      width: 60,
                      height: 70,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text appearance="hint" category="h6">
                      {item.day}
                    </Text>
                    <Text category="h6" style={{ fontWeight: "bold" }}>
                      {days[item.dayIdx]}
                    </Text>
                    <Text appearance="hint">{months[item.monthIdx]}</Text>
                  </Layout>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.setState({
                  selectedIndex: -1,
                  currSelected: true,
                });
              }}
            >
              <Layout
                level={this.state.selectedIndex === -1 ? "3" : "1"}
                style={{
                  width: 60,
                  height: 70,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  style={{ width: 24, height: 24 }}
                  fill="#8F9BB3"
                  name="calendar-outline"
                />
                <Text appearance="hint">Current</Text>
              </Layout>
            </TouchableOpacity>
          </Layout>

          <Divider />

          <Layout level="2" style={{ padding: 10 }}>
            <Text category="h6" appearance="hint">
              {strings.MySymptoms}
            </Text>
          </Layout>
          <Divider />

          <Layout style={{ flex: 1 }}>
            <MapboxGL.UserLocation
              visible={true}
              showsUserHeadingIndicator={true}
              onUpdate={this.onUserLocationUpdate}
            />
            {this.state.loading ? (
              <Layout
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner />
              </Layout>
            ) : this.state.currSelected ? (
              this.state.currUserSymptoms.length === 0 ? (
                this.emptySymptomList()
              ) : (
                this.contents()
              )
            ) : this.state.filteredData.length === 0 ? (
              this.emptySymptomList()
            ) : (
              <List
                data={this.state.filteredData}
                renderItem={({ item }) => (
                  <>
                    <Layout
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingVertical: 7,
                      }}
                    >
                      <Layout style={{ justifyContent: "center" }}>
                        <Text category="h6">{item.name}</Text>
                        <Text appearance="hint">
                          Registered {this.getParsedDate(item.start)}
                        </Text>
                      </Layout>
                      <Layout
                        style={{
                          width: 50,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: this.colors[item.relevance],
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                          }}
                        />
                        <Text appearance="hint">{item.relevance}</Text>
                      </Layout>
                    </Layout>
                    <Divider />
                  </>
                )}
              />
            )}
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
const styles = StyleSheet.create({
  contanier: { flex: 1 },
});
