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
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g"
);

import userIDStore from "../../data-management/user-id-data/userIDStore";
import symptomStore from "../../data-management/user-symptom-data/symptomStore";
import * as symptomActions from "../../data-management/user-symptom-data/symptomActions";
import languageStore from "../../data-management/language_data/languageStore";
import { strings } from "../../localization/localization";

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
      months: [
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
      ],
      days: [
        strings.Sun,
        strings.Mon,
        strings.Tue,
        strings.Wed,
        strings.Thu,
        strings.Fri,
        strings.Sat,
      ],
    };

    symptomStore.subscribe(() => {
      //this.fetchUserSymptoms(userIDStore.getState().userId);
      this.fetchData();
    });

    languageStore.subscribe(() => {
      strings.setLanguage(languageStore.getState());
      this.componentDidMount();
    });

    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
  }

  onUserLocationUpdate(location) {
    this.setState({ user_latitude: location.coords.latitude });
    this.setState({ user_longitude: location.coords.longitude });
  }

  //sends user location
  sendLocation = () => {
    fetch("https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/user_locations", {
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
  };

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
        await this.setState({ currLanguage: "Turkish" });
        break;
    }
    this.fetchUserSymptoms(userIDStore.getState().userId);
    this.fetchData();
    this.populateCalander();
    this.fetchSymptom();

    this.timer = setInterval(() => {
      if (this.state.currUserSymptoms.length !== 0) {
        console.log("Normal check");
        this.sendLocation();
      }
    }, 10000);
  };

  //populates top calendar list
  populateCalander = () => {
    caladerData = [];

    for (let index = 1; index < 14; index++) {
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

  //compare dates
  compareDate = (date1, date2) => {
    return (
      date1.getDate() >= date2.getDate() &&
      date1.getMonth() >= date2.getMonth() &&
      date1.getFullYear() >= date2.getFullYear()
    );
  };

  //loads users symptom from the redux local store
  fetchData() {
    this.setState({ currUserSymptoms: symptomStore.getState() });
  }

  //fetches historical data
  fetchSymptom = async () => {
    let newThis = this; // create variable for referencing 'this'
    fetch(
      `https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuserhistory/user/${
        userIDStore.getState().userId
      }?language=${this.state.currLanguage}`,
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
        newThis.setState(
          {
            data: json.events,
          },
          () => {
            this.populateBadge();
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  populateBadge = () => {
    let newData = [];

    for (
      let calender_idx = 0;
      calender_idx < this.state.calendar.length;
      calender_idx++
    ) {
      const calender_cell = this.state.calendar[calender_idx];
      const selectedDate = new Date(calender_cell.compareDate);
      let showBadge = false;

      for (let data_idx = 0; data_idx < this.state.data.length; data_idx++) {
        const data_cell = this.state.data[data_idx];

        const bool =
          this.compareDate(selectedDate, new Date(data_cell.start)) &&
          this.compareDate(new Date(data_cell.end), selectedDate);

        if (bool) {
          showBadge = true;
          break;
        }
      }

      newData.push({ ...calender_cell, showBadge });
    }

    this.setState({ calendar: newData });
  };

  //parses date
  getParsedDate = (unparsedDate) => {
    date = new Date(unparsedDate);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} - ${date.getFullYear()}`;
  };

  //update Ui with the filtered date
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
      "https://a2sv-api-wtupbmwpnq-uc.a.run.app/api/symptomuser/user/" +
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
                    {item.showBadge ? (
                      <View
                        style={{
                          height: 4,
                          width: 10,
                          borderRadius: 2,
                          backgroundColor: "#f57c00",
                        }}
                      />
                    ) : (
                      <View style={{ height: 4 }} />
                    )}
                    <Text appearance="hint" category="h6">
                      {item.day}
                    </Text>
                    <Text category="h6" style={{ fontWeight: "bold" }}>
                      {this.state.days[item.dayIdx]}
                    </Text>
                    <Text appearance="hint">
                      {this.state.months[item.monthIdx]}
                    </Text>
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
                <Text appearance="hint">{strings.Current}</Text>
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
                      </Layout>
                      <Layout style={{ justifyContent: "center" }}>
                        <Text appearance="hint">
                          Registered {this.getParsedDate(item.start)}
                        </Text>
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
